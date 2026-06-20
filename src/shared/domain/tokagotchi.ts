import type { Evolution } from "./evolution";
import type { EquippedAccessory } from "./accessory";

// Rarezas disponibles
export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
// Especies disponibles
export type Species = "TOFU" | "MOCHI" | "HANA";

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

// Tokagotchi principal
export interface TokagotchiActive {
  id: number;
  name: string;
  species: Species;
  rarity: Rarity;
  stats: Stats;
  abilities: Ability[];
  equipped: EquippedAccessory[];
  cp: number;
  assets: Assets;
  evolution: Evolution | null;
  care: CareTimestamps;
}