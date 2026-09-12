import type { PaginatedResponseDTO } from "@/shared/api/dto/pagination.dto";

/**
 * Contratos del módulo PvP, copiados de los DTO del backend.
 *
 * Los nombres son los del servidor, sin traducir: cualquier renombre aquí
 * escondería una discrepancia con la API en lugar de hacerla evidente.
 */

// ── Emparejamiento ──────────────────────────────────────────────────────────

/** `QueueStatusResponse`. */
export interface QueueStatusDTO {
  status: "NOT_QUEUED" | "SEARCHING" | "MATCHED";
  /** 0 si no está encolado. */
  queuedAtMillis: number;
  waitingSeconds: number;
  playersInQueue: number;
}

// ── Combate ─────────────────────────────────────────────────────────────────

/**
 * `FighterStateResponse`.
 *
 * Trae un campo por cada efecto activo, con los turnos que le quedan.
 * `lib/battleStatus` los recoge para que las vistas no conozcan los doce.
 */
export interface FighterStateDTO {
  playerId: string;
  name: string;
  species: string;
  currentHp: number;
  maxHp: number;
  currentEnergy: number;
  currentSpd: number;

  roarAtkBuffTurns: number;
  guardDefenseBuffTurns: number;
  agilityEvasionTurns: number;
  barkShieldHp: number;
  barkShieldTurns: number;
  regenerationTurns: number;
  ancestralForestTurns: number;
  weakenDefDebuffTurns: number;
  wrathElixirTurns: number;
  ironShieldTurns: number;
  burnTurns: number;
  poisonTurns: number;
  paralysisTurns: number;

  /** Pociones que le quedan en este combate, por tipo. */
  potions: Record<string, number>;
}

/** `BattleStateBroadcastResponse`. Llega íntegro, nunca como delta. */
export interface BattleStateDTO {
  eventType: string;
  battleSessionId: string;
  currentTurn: number;
  activePlayerId: string;
  /** Unix ms: al pasar, el servidor fuerza un descanso automático. */
  turnDeadlineMilli: number;
  lastActionDescription: string;
  /** Indexado por `playerId`. */
  fighters: Record<string, FighterStateDTO>;
}

/** `BattleHistorySummaryResponse`. */
export interface BattleHistorySummaryDTO {
  battleId: string;
  opponentName: string;
  opponentTokagotchiName: string;
  /** Desde la perspectiva de quien consulta. */
  result: "WIN" | "LOSS" | "DRAW";
  totalTurns: number;
  finishedAt: string;
}

export type BattleHistoryPageDTO = PaginatedResponseDTO<BattleHistorySummaryDTO>;

// ── Pociones ────────────────────────────────────────────────────────────────

/** `PlayerPotionResponse`. */
export interface PlayerPotionDTO {
  potionType: string;
  displayName: string;
  /** Unidades en el inventario. */
  quantity: number;
  /** Unidades reservadas para el próximo combate. */
  equippedQuantity: number;
  price: number;
  limitPerBattle: number;
  description: string;
}
