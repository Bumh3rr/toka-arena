import type { Rarity } from "../types/tokagotchi";

export interface RarityMeta {
  label: string;
  ring: string;
  soft: string;
  order: number;
}

export const RARITY_META: Record<Rarity, RarityMeta> = {
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
