// types/evolution.ts
import type { Rarity } from "./tokagotchi";

// Reglas para evolucionar al Tokagotchi
export interface EvolutionRule {
  nextRarity: Rarity; // Siguiente rareza por debloquear
  cpRequired: number; // CP mínimos para intentar
  costTF: number; // costo del intento (TF)
  successChance: number; // probabilidad de éxito (0–100)
  failCooldownHours: number; // cooldown que se aplica SI el intento falla (12,24,48 hrs)
}

// Cooldown ACTIVO tras un intento fallido.
export interface EvolutionCooldown {
  endsAt: string; // Si la evolucion fallo, se mostrará el tiempo en formato timestamp
}

// Evolución del Tokagotchi
export interface Evolution {
  rule: EvolutionRule | null; // null = ya es la rareza máxima
  cooldown: EvolutionCooldown | null; // null = sin cooldown activo
}

// Motivo por el que NO se puede evolucionar
export type EvolutionBlocker = | "MAX_RARITY" | "ON_COOLDOWN" | "NOT_ENOUGH_CP" | "NOT_ENOUGH_TF";

// Estado calculado para la UI. NO se almacena: se deriva con getEvolutionStatus.
export interface EvolutionStatus {
  canEvolve: boolean; // Saber se puede evolucionar
  blocker: EvolutionBlocker | null; // Tipo de Bloqueo de Evolucion
  cpProgress: number; // 0–1, para la barra
  cooldownEndsAt: string | null; // Tiempo restante para volver a intentar evolucionar
}

// ── Selectores (lógica derivada para la UI) ────────────────────────
export function getEvolutionStatus(
  evolution: Evolution | null,
  currentCP: number,
  userTF: number,
): EvolutionStatus {
  // Si no hay regla es por que ya esta en la maxima rareza
  if (!evolution?.rule){
    return { canEvolve: false, blocker: "MAX_RARITY", cpProgress: 1, cooldownEndsAt: null };
  }

  const { cpRequired, costTF } = evolution.rule;
  const cpProgress = Math.min(currentCP / cpRequired, 1);
  const onCooldown = !!evolution.cooldown && new Date(evolution.cooldown.endsAt).getTime() > Date.now();

  // Orden de prioridad de los bloqueos
  let blocker: EvolutionBlocker | null = null;
  if (onCooldown) blocker = "ON_COOLDOWN";
  else if (currentCP < cpRequired) blocker = "NOT_ENOUGH_CP";
  else if (userTF < costTF) blocker = "NOT_ENOUGH_TF";

  return {
    canEvolve: blocker === null,
    blocker,
    cpProgress,
    cooldownEndsAt: evolution.cooldown?.endsAt ?? null,
  };
}

// Tiempo restante del cooldown.
export function getCooldownLeft(endsAt: string) {
  const ms = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const minutes = Math.ceil(ms / 60000);
  return {
    minutes,
    hours: Math.floor(minutes / 60),
    mins: minutes % 60,
    done: ms === 0,
  };
}