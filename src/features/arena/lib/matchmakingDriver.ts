import type { IMessage } from "@stomp/stompjs";
import { CHANNELS } from "@/shared/ws/arenaSocket";
import { getApiErrorMessage } from "@/shared/api/client";
import { arenaApi } from "../api/arena.api";
import { mapBattleState } from "../api/mappers/battle.mapper";
import type { BattleStateDTO } from "../api/dto/arena.dto";
import type {
  MatchmakingDriver,
  MatchmakingOutcome,
  SearchHandle,
} from "../types/arena.types";

/**
 * Emparejamiento contra el backend real.
 *
 * El servidor **no avisa de que no hay rivales**: la cola espera indefinidamente
 * a que alguien más entre. Como la pantalla sí tiene ese estado, lo decide el
 * cliente tras {@link EMPTY_AFTER_MS} sin pareja, saliéndose de la cola. Sin
 * ese corte el jugador se quedaría mirando una búsqueda eterna.
 */

/** Tras esto se da la búsqueda por vacía y se abandona la cola. */
const EMPTY_AFTER_MS = 45_000;

/** Cada cuánto se consulta el tamaño de la cola. El match llega por WebSocket. */
const QUEUE_POLL_MS = 4_000;

interface MatchmakingDriverOptions {
  /** Id del jugador, para saber cuál de los dos combatientes es el rival. */
  myPlayerId: string;
  subscribe: (destination: string, handler: (message: IMessage) => void) => () => void;
}

export function createMatchmakingDriver({
  myPlayerId,
  subscribe,
}: MatchmakingDriverOptions): MatchmakingDriver {
  return {
    search({ onQueue, onOutcome }): SearchHandle {
      let live = true;
      let poll = 0;
      let giveUp = 0;

      const finish = (outcome: MatchmakingOutcome) => {
        if (!live) return;
        live = false;
        window.clearInterval(poll);
        window.clearTimeout(giveUp);
        unsubscribe();
        onOutcome(outcome);
      };

      /*
       * Suscribirse ANTES de encolarse. El emparejador corre cada 3 s y puede
       * juntar la pareja entre la petición y la suscripción; si se hiciera al
       * revés, ese match llegaría a un canal que nadie escucha.
       */
      const unsubscribe = subscribe(CHANNELS.matchFound, (message: IMessage) => {
        const state = mapBattleState(JSON.parse(message.body) as BattleStateDTO);

        const rival = Object.values(state.fighters).find((f) => f.playerId !== myPlayerId);
        if (!rival) return;

        finish({
          kind: "matched",
          battleId: state.battleId,
          // El contrato no trae dueño ni rareza del rival, solo nombre y especie
          rival: { name: rival.name, species: rival.species },
          firstIsMe: state.activePlayerId === myPlayerId,
        });
      });

      const enqueue = async () => {
        try {
          /*
           * Salir antes de entrar. `DELETE` es idempotente y evita el 400 por
           * "ya encolado" cuando se reintenta tras una reconexión: el servidor
           * saca de la cola a quien pierde el WebSocket, pero el estado local
           * puede no haberse enterado todavía.
           */
          await arenaApi.leaveQueue();
          const status = await arenaApi.joinQueue();
          if (!live) return;

          onQueue(status.playersInQueue);
        } catch (error) {
          finish({ kind: "error", message: getApiErrorMessage(error, "No se pudo entrar a la cola") });
        }
      };

      void enqueue();

      poll = window.setInterval(async () => {
        try {
          const status = await arenaApi.getQueueStatus();
          if (live) onQueue(status.playersInQueue);
        } catch {
          // El contador de espera es adorno: si falla, la búsqueda sigue
        }
      }, QUEUE_POLL_MS);

      giveUp = window.setTimeout(() => {
        void arenaApi.leaveQueue().catch(() => {});
        finish({ kind: "empty" });
      }, EMPTY_AFTER_MS);

      return {
        cancel() {
          if (!live) return;
          live = false;
          window.clearInterval(poll);
          window.clearTimeout(giveUp);
          unsubscribe();
          void arenaApi.leaveQueue().catch(() => {});
        },
      };
    },
  };
}
