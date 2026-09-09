import useSWR from "swr";
import { getApiErrorMessage } from "@/shared/api/client";
import { arenaApi } from "../api/arena.api";
import type { BattleHistorySummaryDTO } from "../api/dto/arena.dto";
import type { BattleOutcome } from "../types/arena.types";

/** Cuántos combates se traen. Es lo que cabe sin paginar en el panel. */
export const HISTORY_SIZE = 20;

export const HISTORY_KEY = "arena.history";

export interface BattleRecap {
  battleId: string;
  opponentName: string;
  opponentTokagotchiName: string;
  result: BattleOutcome;
  totalTurns: number;
  finishedAt: number;
}

export type BattleHistoryState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; battles: BattleRecap[]; wins: number; losses: number };

interface UseBattleHistoryResult {
  state: BattleHistoryState;
  reload: () => void;
}

/**
 * Últimos combates del jugador.
 *
 * El backend no publica un marcador acumulado —no hay endpoint que devuelva
 * victorias y derrotas totales—, así que las cuentas son **de estos
 * {@link HISTORY_SIZE} combates**, no de toda la vida del jugador. La vista lo
 * dice con esas palabras en lugar de presentarlo como un récord histórico.
 */
export function useBattleHistory(): UseBattleHistoryResult {
  const { data, error, isLoading, mutate } = useSWR(HISTORY_KEY, () =>
    arenaApi.getMyBattles(0, HISTORY_SIZE),
  );

  const battles = (data?.content ?? []).map(toRecap);

  const state: BattleHistoryState = isLoading
    ? { status: "loading" }
    : error
      ? { status: "error", error: getApiErrorMessage(error) }
      : {
          status: "ready",
          battles,
          wins: battles.filter((b) => b.result === "WIN").length,
          losses: battles.filter((b) => b.result === "LOSS").length,
        };

  return { state, reload: () => void mutate() };
}

function toRecap(dto: BattleHistorySummaryDTO): BattleRecap {
  return {
    battleId: dto.battleId,
    opponentName: dto.opponentName,
    opponentTokagotchiName: dto.opponentTokagotchiName,
    result: dto.result,
    totalTurns: dto.totalTurns,
    finishedAt: new Date(dto.finishedAt).getTime(),
  };
}
