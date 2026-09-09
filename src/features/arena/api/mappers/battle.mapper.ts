import type { Species } from "@/shared/domain/tokagotchi";
import { readStatus } from "../../lib/battleStatus";
import type {
  BattleEventType,
  BattleFighter,
  BattleState,
  PotionId,
} from "../../types/arena.types";
import type { BattleStateDTO, FighterStateDTO } from "../dto/arena.dto";

/** Momentos que el servidor sabe anunciar. */
const EVENT_TYPES: BattleEventType[] = [
  "INICIO_BATALLA",
  "ACCION",
  "TIMEOUT",
  "FIN_DE_BATALLA",
  "ESTADO_ACTUAL",
];

/**
 * Un evento desconocido no rompe la pantalla.
 *
 * Si el backend añade un `eventType` nuevo, tratarlo como una acción más deja
 * el combate jugable: el estado que acompaña al mensaje sigue siendo válido y
 * es lo único que la interfaz necesita para pintar.
 */
function readEventType(raw: string): BattleEventType {
  return EVENT_TYPES.includes(raw as BattleEventType) ? (raw as BattleEventType) : "ACCION";
}

/**
 * Pociones restantes, quedándose solo con las que el front conoce.
 *
 * Si el backend diera de alta un tipo nuevo, la vista lo ignoraría en vez de
 * intentar pintar una poción sin nombre ni imagen.
 */
function readPotions(raw: Record<string, number>): Partial<Record<PotionId, number>> {
  const potions: Partial<Record<PotionId, number>> = {};

  for (const [type, left] of Object.entries(raw ?? {})) {
    potions[type as PotionId] = left;
  }

  return potions;
}

function mapFighter(dto: FighterStateDTO): BattleFighter {
  return {
    playerId: dto.playerId,
    name: dto.name,
    species: dto.species as Species,
    currentHp: dto.currentHp,
    maxHp: dto.maxHp,
    currentEnergy: dto.currentEnergy,
    currentSpd: dto.currentSpd,
    potions: readPotions(dto.potions),
    status: readStatus(dto),
  };
}

/** Estado de combate listo para las vistas. */
export function mapBattleState(dto: BattleStateDTO): BattleState {
  const fighters: Record<string, BattleFighter> = {};

  for (const [playerId, fighter] of Object.entries(dto.fighters)) {
    fighters[playerId] = mapFighter(fighter);
  }

  return {
    eventType: readEventType(dto.eventType),
    battleId: dto.battleSessionId,
    currentTurn: dto.currentTurn,
    activePlayerId: dto.activePlayerId,
    turnDeadlineMilli: dto.turnDeadlineMilli,
    lastActionDescription: dto.lastActionDescription,
    fighters,
  };
}
