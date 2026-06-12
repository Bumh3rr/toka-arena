import type { Evolution } from "./evolution";

// Rarezas disponibles
export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

// Especies disponibles
export type Species = "TOFU" | "MOCHI" | "HANA";

// Tipos de Accesorioos
export type TypeAccessory = "HEAD" | "BODY";

// Animaciones disponibles para el Tokagotchi
export type AnimationTokagotchi =
  | "idle"
  | "ataque"
  | "comer"
  | "bañar"
  | "curacion"
  | "daño"
  | "jugar";

export interface EquippedAccessory {
  id: number;
  name: string;
  typeAccessory: TypeAccessory;
  displayIndex: number;
}

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

// Tokagotchi principal
export interface Tokagotchi {
  id: number;
  name: string;
  species: Species;
  rarity: Rarity;
  stats: Stats;
  abilities: Ability[];
  equippedAccessory: {
    equippedHead: EquippedAccessory | null;
    equippedBody: EquippedAccessory | null;
  };
  cp: number;
  assets: Assets;
  evolution: Evolution | null;
}

// Animaciones disponibles
export type TokagotchiAnimacion =
  | "idle"
  | "feed"
  | "play"
  | "heal"
  | "bath"
  | "attack"
  | "hurt"
  | "ko"
  | "win"
  | "battle_idle";

export const RAR = {
  COMMON: {
    label: "Común",
    ring: "#A0A0A0",
    soft: "rgba(160,160,160,.30)",
    order: 0,
  },
  RARE: {
    label: "Raro",
    ring: "#3D99FF",
    soft: "rgba(61,153,255,.30)",
    order: 1,
  },
  EPIC: {
    label: "Épico",
    ring: "#A335EE",
    soft: "rgba(163,53,238,.30)",
    order: 2,
  },
  LEGENDARY: {
    label: "Legendario",
    ring: "#FF8000",
    soft: "rgba(255,128,0,.32)",
    order: 3,
  },
};
