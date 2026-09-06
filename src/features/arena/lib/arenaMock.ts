import { POTIONS_META, POTION_SLOT_COUNT } from "../constants/potions";
import type { ArenaLobbyData, PotionSlot } from "../types/arena.types";

/**
 * ARCHIVO TEMPORAL — la API de batallas todavía no existe.
 *
 * Es la única fuente falsa del módulo: estamina, historial y pociones
 * equipadas. Cuando el backend esté listo se borra este archivo y se cambia
 * el cuerpo de `useArenaLobby`; ninguna vista se toca.
 */

const MAX_STAMINA = 10;
const CURRENT_STAMINA = 7;
/** Cadencia de regeneración: un punto cada 3 minutos. */
const REFILL_INTERVAL_MS = 3 * 60_000;
/** Lo que falta para el siguiente punto en el momento de abrir el lobby. */
const NEXT_REFILL_IN_MS = 84_000;

/** Pociones que el jugador lleva puestas. Un null es una ranura vacía. */
const EQUIPPED_POTIONS = [
  POTIONS_META.LESSER_HEALING,
  POTIONS_META.GREATER_HEALING,
  POTIONS_META.ENERGY_BREW,
];

function buildPotionSlots(): PotionSlot[] {
  return Array.from({ length: POTION_SLOT_COUNT }, (_, index) => ({
    index,
    potion: EQUIPPED_POTIONS[index] ?? null,
  }));
}

export function getArenaMock(): ArenaLobbyData {
  const isFull = CURRENT_STAMINA >= MAX_STAMINA;

  return {
    stamina: {
      current: CURRENT_STAMINA,
      max: MAX_STAMINA,
      nextRefillAt: isFull ? null : Date.now() + NEXT_REFILL_IN_MS,
      fullRefillCostTF: 50,
    },
    record: { wins: 7, losses: 3 },
    potions: buildPotionSlots(),
  };
}

export { REFILL_INTERVAL_MS };
