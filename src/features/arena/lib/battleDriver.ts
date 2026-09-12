import type { IMessage } from "@stomp/stompjs";
import { BATTLE_ACTION_DESTINATION, CHANNELS, battleTopic } from "@/shared/ws/arenaSocket";
import { arenaApi } from "../api/arena.api";
import { mapBattleState } from "../api/mappers/battle.mapper";
import type { BattleStateDTO } from "../api/dto/arena.dto";
import type { BattleAction, BattleDriver } from "../types/arena.types";

interface BattleDriverOptions {
  battleId: string;
  subscribe: (destination: string, handler: (message: IMessage) => void) => () => void;
  publish: (destination: string, body: unknown) => boolean;
  /** Aviso de que una acción no llegó a salir, para poder decírselo al jugador. */
  onDropped: (message: string) => void;
}

/**
 * Combate contra el backend real.
 *
 * Las acciones salen por `/app/battle/action` y el estado entra por
 * `/topic/battle/{id}`. Nada de lo que se envía se aplica en local: el
 * servidor es el único que mueve el combate, y la pantalla solo dibuja lo que
 * le llega. Así no hay forma de que la interfaz y la partida se separen.
 */
export function createBattleDriver({
  battleId,
  subscribe,
  publish,
  onDropped,
}: BattleDriverOptions): BattleDriver {
  return {
    connect({ onState, onError }) {
      const unsubscribeBattle = subscribe(battleTopic(battleId), (message: IMessage) => {
        onState(mapBattleState(JSON.parse(message.body) as BattleStateDTO));
      });

      /*
       * Los errores del servidor llegan como TEXTO PLANO por un canal privado,
       * no como respuesta a la acción: por WebSocket no hay respuesta directa.
       * Son para avisar al jugador, no para ramificar lógica.
       */
      const unsubscribeErrors = subscribe(CHANNELS.errors, (message: IMessage) => {
        onError(message.body);
      });

      /*
       * Pedir el estado actual además de suscribirse. Entre el emparejamiento
       * y esta suscripción puede haberse perdido algún mensaje —o el jugador
       * puede estar volviendo tras recargar la app—, y sin esto la pantalla se
       * quedaría en blanco hasta que alguien moviera ficha.
       */
      void arenaApi
        .getBattle(battleId)
        .then((dto) => onState(mapBattleState(dto)))
        .catch(() => {
          // Si ya terminó o no existe, el canal traerá el desenlace o la
          // pantalla saldrá por su cuenta. No hay nada que reintentar.
        });

      return {
        disconnect() {
          unsubscribeBattle();
          unsubscribeErrors();
        },
      };
    },

    send(action: BattleAction) {
      const body =
        action.type === "SKILL"
          ? { battleSessionId: battleId, actionType: "SKILL", skill: action.skill }
          : action.type === "POTION"
            ? { battleSessionId: battleId, actionType: "POTION", potion: action.potion }
            : { battleSessionId: battleId, actionType: "REST" };

      // Sin conexión el mensaje se perdería en silencio y el jugador creería
      // haber jugado su turno mientras el reloj del servidor sigue corriendo.
      if (!publish(BATTLE_ACTION_DESTINATION, body)) {
        onDropped("Sin conexión: tu acción no se envió.");
      }
    },

    surrender() {
      void arenaApi.surrender(battleId).catch(() => {
        onDropped("No se pudo abandonar el combate.");
      });
    },
  };
}
