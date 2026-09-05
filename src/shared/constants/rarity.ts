import type { CSSProperties } from "react";
import type { NextRarity, Rarity } from "../domain/tokagotchi";

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

export const NEXT_RARITY_META: Record<NextRarity, RarityMeta> = {
  ...RARITY_META,
  MAX: {
    label: "Máximo",
    ring: "#FFD700",
    soft: "rgba(255,215,0,.30)",
    order: 4,
  },
};

// ── Sparkles ────────────────────────────────────────────────────────────────
export const SPARKLE_POS: CSSProperties[] = [
  { top: '14%', left: '16%' },
  { top: '9%',  left: '50%' },
  { top: '16%', right: '14%' },
  { top: '52%', left: '8%' },
  { top: '46%', right: '10%' },
  { top: '74%', left: '20%' },
  { top: '70%', right: '18%' },
]
export const SPARKLE_COUNT: Record<Rarity, number> = { COMMON: 3, RARE: 4, EPIC: 5, LEGENDARY: 7 }
