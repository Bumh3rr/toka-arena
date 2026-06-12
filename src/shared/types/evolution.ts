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