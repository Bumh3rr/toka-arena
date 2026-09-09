import type { StatusEffect } from "../types/arena.types";

/**
 * Traduce los contadores de efectos del servidor a etiquetas.
 *
 * `FighterStateResponse` manda un campo por efecto —doce en total— y cada uno
 * vale 0 cuando no está activo. Recogerlos aquí evita que cada vista tenga que
 * conocer los doce nombres, y deja añadir un efecto nuevo en una sola línea.
 *
 * El orden importa: primero lo que hace daño, porque es lo que el jugador
 * necesita ver primero cuando solo caben dos etiquetas.
 */
interface StatusSource {
  burnTurns?: number;
  poisonTurns?: number;
  paralysisTurns?: number;
  weakenDefDebuffTurns?: number;
  roarAtkBuffTurns?: number;
  guardDefenseBuffTurns?: number;
  agilityEvasionTurns?: number;
  wrathElixirTurns?: number;
  ironShieldTurns?: number;
  regenerationTurns?: number;
  ancestralForestTurns?: number;
  barkShieldTurns?: number;
  barkShieldHp?: number;
}

interface StatusSpec {
  key: keyof StatusSource;
  id: string;
  label: string;
  harmful: boolean;
}

const SPECS: StatusSpec[] = [
  { key: "burnTurns", id: "burn", label: "Quemadura", harmful: true },
  { key: "poisonTurns", id: "poison", label: "Veneno", harmful: true },
  { key: "paralysisTurns", id: "paralysis", label: "Parálisis", harmful: true },
  { key: "weakenDefDebuffTurns", id: "weaken", label: "DEF baja", harmful: true },
  { key: "roarAtkBuffTurns", id: "roar", label: "ATK alto", harmful: false },
  { key: "wrathElixirTurns", id: "wrath", label: "Furia", harmful: false },
  { key: "guardDefenseBuffTurns", id: "guard", label: "Guardia", harmful: false },
  { key: "ironShieldTurns", id: "iron", label: "Escudo férreo", harmful: false },
  { key: "agilityEvasionTurns", id: "agility", label: "Evasión", harmful: false },
  { key: "regenerationTurns", id: "regen", label: "Regeneración", harmful: false },
  { key: "ancestralForestTurns", id: "thorns", label: "Espinas", harmful: false },
];

export function readStatus(source: StatusSource): StatusEffect[] {
  const active: StatusEffect[] = [];

  for (const spec of SPECS) {
    const amount = source[spec.key] ?? 0;
    if (amount > 0) {
      active.push({ id: spec.id, label: spec.label, amount, harmful: spec.harmful });
    }
  }

  // El escudo de HANA se cuenta en HP, no en turnos: lo que importa es cuánto
  // aguanta todavía, no cuántas rondas le quedan de vida.
  const shield = source.barkShieldHp ?? 0;
  if (shield > 0) {
    active.push({ id: "barkShield", label: "Escudo", amount: shield, harmful: false });
  }

  return active;
}
