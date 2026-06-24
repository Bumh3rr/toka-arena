// types/evolution.ts
import type { Rarity } from "./tokagotchi";

// Evolución del Tokagotchi
export interface Evolution {
  nextRarity: Rarity; // Siguiente rareza por debloquear
  cpRequired: number; // CP mínimos para intentar
  tfRequired: number; // costo del intento (TF)
  successChance: number; // probabilidad de éxito (0–100)
  failCooldownHours: number; // cooldown que se aplica SI el intento falla (12,24,48 hrs)
  evolvedAvailableAt: number | null; // fecha desde la cual se puede intentar esta evolución (null = siempre disponible)
}