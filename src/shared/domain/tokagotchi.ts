import type { EquippedAccessory } from "./accessory";

// Rarezas disponibles
export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
// Especies disponibles
export type Species = "TOFU" | "MOCHI" | "HANA";
// Siguientes rarezas disponibles para evolución
export type NextRarity = Rarity | "MAX";

// Animaciones disponibles para el Tokagotchi
export type AnimationTokagotchi =
  | "idle"
  | "ataque"
  | "comer"
  | "bañar"
  | "curacion"
  | "daño"
  | "jugar";

// Stats del Tokagotchi
export interface Stats {
  hp: number;
  atk: number;
  def: number;
}

// Habilidad
export interface Ability {
  id: number;
  name: string;
  energyCost: number;
  multiplier: number;
  description: string;
  isSignature: boolean;
}

// Assets necesarios para renderizar el Tokagotchi
export interface Assets {
  texPng: string;
  texJson: string;
  skeJson: string;
  armatureKey: string;
}

export interface CareTimestamps {
  feed: number | null;
  play: number | null;
  bathe: number | null;
}

// Evolución del Tokagotchi
export interface Evolution {
  nextRarity: NextRarity; // Siguiente rareza por debloquear
  cpRequired: number; // CP mínimos para intentar
  tfRequired: number; // costo del intento (TF)
  successChance: number; // probabilidad de éxito (0–100)
  failCooldownHours: number; // cooldown que se aplica SI el intento falla (12,24,48 hrs)
  evolvedAvailableAt: number | null; // fecha desde la cual se puede intentar esta evolución (null = siempre disponible)
}

// Tokagotchi principal
export interface Tokagotchi {
  id: string;
  name: string;
  species: Species;
  rarity: Rarity;
  stats: Stats;
  cp: number;
  equipped: EquippedAccessory[];
  nextEvolution: Evolution | null;
  careCooldown: CareTimestamps;
}