import { useEffect, useState } from "react";
import { arenaApi } from "../api/arena.api";
import { mapBattleState } from "../api/mappers/battle.mapper";
import type { MatchFound } from "../types/arena.types";

export type ActiveBattleState =
  | { status: "checking" }
  /** No hay combate en curso: el caso normal. */
  | { status: "none" }
  | { status: "found"; match: MatchFound };

interface UseActiveBattleOptions {
  myPlayerId: string | null;
  /**
   * Se llama una sola vez, con el combate rescatado.
   *
   * El aviso sale de aquí y no de un estado que el consumidor tenga que
   * vigilar: quien manda es la respuesta del servidor, y encadenar un efecto
   * para copiarla a otro estado solo añadiría un render de más.
   */
  onFound: (match: MatchFound) => void;
}

/**
 * Rescata un combate que quedó a medias.
 *
 * El servidor guarda la sesión en Redis con un puntero por jugador, así que
 * recargar la app —o que el sistema mate el webview— no pierde la pelea. Sin
 * esto el jugador volvería al lobby con una batalla viva a su nombre, sin poder
 * jugarla y perdiéndola por el temporizador.
 *
 * El emparejamiento se reconstruye desde el estado: es lo mismo que llega por
 * `match-found`, solo que pedido en vez de recibido.
 *
 * El saldo de partida para las recompensas lo sigue tomando la pantalla de
 * combate, y sigue siendo correcto al volver a medias: el servidor paga **al
 * terminar**, así que el perfil que hay ahora todavía es el de antes de cobrar.
 */
export function useActiveBattle({
  myPlayerId,
  onFound,
}: UseActiveBattleOptions): ActiveBattleState {
  const [state, setState] = useState<ActiveBattleState>({ status: "checking" });

  useEffect(() => {
    if (!myPlayerId) return;

    let live = true;

    void arenaApi.getActiveBattle().then((dto) => {
      if (!live) return;

      if (!dto) {
        setState({ status: "none" });
        return;
      }

      const battle = mapBattleState(dto);
      const me = battle.fighters[myPlayerId];
      const rival = Object.values(battle.fighters).find((f) => f.playerId !== myPlayerId);

      if (!me || !rival) {
        setState({ status: "none" });
        return;
      }

      const match: MatchFound = {
        battleId: battle.battleId,
        me: { name: me.name, species: me.species },
        rival: { name: rival.name, species: rival.species },
        firstIsMe: battle.activePlayerId === myPlayerId,
      };

      setState({ status: "found", match });
      onFound(match);
    });

    return () => {
      live = false;
    };
  }, [myPlayerId, onFound]);

  return state;
}
