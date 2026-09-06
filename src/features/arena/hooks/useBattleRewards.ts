import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { usePlayer } from "@/shared/player/hooks/usePlayer";
import type { PlayerProfile } from "@/shared/player/data/player";
import { EXPECTED_REWARDS } from "../constants/results";
import { readStamina } from "../lib/stamina";
import { HISTORY_KEY } from "./useBattleHistory";
import { POTIONS_KEY } from "./usePotionLoadout";
import type { ResultKind, Stamina } from "../types/arena.types";

interface Rewards {
  tf: number;
  cp: number;
}

export type BattleRewardsState =
  | { status: "loading" }
  | {
      status: "ready";
      rewards: Rewards;
      /** Saldo con el que se queda el jugador. */
      tfTotal: number;
      stamina: Stamina;
      profile: PlayerProfile;
    };

/**
 * Lo que el combate dejó en el bolsillo del jugador.
 *
 * El servidor **no manda las recompensas**: las aplica sobre el perfil y ya.
 * Así que se comparan el antes y el después — el saldo de partida lo toma el
 * combate al empezar, aquí se revalida el perfil, y la diferencia es lo que se
 * ganó. Es exacto y no se desactualiza: si el backend cambia lo que paga, la
 * pantalla lo refleja sin tocar nada aquí.
 *
 * Mientras el perfil nuevo no llegue —o si nunca llega— la diferencia da cero
 * y se usa la tabla conocida: enseñar "+0 TF" tras ganar sería peor que un
 * número de respaldo.
 */
export function useBattleRewards(
  kind: ResultKind,
  before: { tf: number; cp: number },
): BattleRewardsState {
  const { state, reload } = usePlayer();
  const { mutate } = useSWRConfig();

  /*
   * El perfil en caché es el de antes del combate —nadie lo revalida mientras
   * se pelea—, así que hay que ir a buscar el de después para poder comparar.
   *
   * La pantalla **no espera** a que llegue: se pinta con lo que hay y las
   * cifras se corrigen solas cuando el perfil nuevo entre. Antes esperaba, y
   * con la API caída se quedaba en "Contando la recompensa..." para siempre —
   * el jugador acababa de pelear y merece ver su resultado aunque la red falle.
   */
  useEffect(() => {
    void reload().catch(() => {
      // Sin perfil nuevo se muestran las recompensas conocidas. No hay nada
      // que reintentar aquí: el servidor ya pagó, solo falta enterarse.
    });

    /*
     * El combate deja obsoletas otras dos cachés y hay que decirlo aquí, que
     * es donde se sabe que la pelea acabó:
     *  · el historial gana una entrada
     *  · el loadout de pociones se vacía — el servidor lo limpia siempre
     * Sin esto, el lobby enseñaría las pociones del combate anterior como si
     * el jugador siguiera llevándolas.
     */
    void mutate(HISTORY_KEY);
    void mutate(POTIONS_KEY);
  }, [reload, mutate]);

  if (state.status !== "ready") return { status: "loading" };

  const expected = EXPECTED_REWARDS[kind];

  const tfGained = state.data.tf - before.tf;
  const cpGained = (state.data.mainTokagotchi?.cp ?? 0) - before.cp;

  return {
    status: "ready",
    rewards: {
      tf: tfGained > 0 ? tfGained : expected.tf,
      cp: cpGained > 0 ? cpGained : expected.cp,
    },
    tfTotal: state.data.tf,
    stamina: readStamina(state.data),
    profile: state.data,
  };
}
