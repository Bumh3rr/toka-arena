import type { Accesorio } from "./accesorios";

// Rarezas disponibles
export type Rareza = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

// Especies disponibles
export type Especie = "tofu" | "mochi" | "hana";

// Stats del Tokagotchi
export interface TokagotchiStats {
  hp: number;
  atk: number;
  def: number;
  nrg: number;
}

// Habilidad
export interface Habilidad {
  id: string;
  nombre: string;
  costoNRG: number;
  multiplicador?: number;
  descripcion: string;
  esSignature: boolean;
}

// Tokagotchi principal
export interface Tokagotchi {
  id: string;
  nombre: string;
  especie: Especie;
  rareza: Rareza;
  stats: TokagotchiStats;
  habilidades: Habilidad[];
  accesorios: {
    cabeza: Accesorio | null;
    cuerpo: Accesorio | null;
  };
  // Assets DragonBones
  assets: {
    texPng: string;
    texJson: string;
    skeJson: string;
    armatureKey: string;
  };
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
