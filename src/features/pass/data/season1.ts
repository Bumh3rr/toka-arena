import type { PassSeason, PassReward } from "../pass.types";

/**
 * Recompensas de la Temporada 1 "Piloto"
 *
 * FREE (8): niveles 3, 7, 11, 15, 19, 23, 27, 30
 * PREMIUM (13): niveles 2, 5, 8, 10, 12, 14, 16, 18, 20, 23, 26, 28, 30
 *
 * Datos estáticos para la vista de diseño; el backend se conectará después
 * en `../api/pass.api.ts` (SWAP POINT)
 */
const REWARDS: PassReward[] = [
  // ── FREE ──────────────────────────────────────────────────────────────
  { level: 3,  lane: "FREE", type: "TOKA_FEED", amount: 25, refPrice: 25 },
  { level: 7,  lane: "FREE", type: "ACCESSORY", accessoryType: "HAT", refPrice: 200 },
  { level: 11, lane: "FREE", type: "TOKA_FEED", amount: 25, refPrice: 25 },
  { level: 15, lane: "FREE", type: "EGG", eggRarity: "COMMON", refPrice: 100 },
  { level: 19, lane: "FREE", type: "TOKA_FEED", amount: 25, refPrice: 25 },
  { level: 23, lane: "FREE", type: "ACCESSORY", accessoryType: "GLASSES", refPrice: 250 },
  { level: 27, lane: "FREE", type: "TOKA_FEED", amount: 50, refPrice: 50 },
  { level: 30, lane: "FREE", type: "ACCESSORY", accessoryType: "MOUSTACHE", refPrice: 300 },

  // ── PREMIUM ───────────────────────────────────────────────────────────
  { level: 2,  lane: "PREMIUM", type: "TOKA_FEED", amount: 75, refPrice: 75 },
  { level: 5,  lane: "PREMIUM", type: "ACCESSORY", accessoryType: "PATCH", refPrice: 100 },
  { level: 8,  lane: "PREMIUM", type: "EGG", eggRarity: "COMMON", refPrice: 100 },
  { level: 10, lane: "PREMIUM", type: "ACCESSORY", accessoryType: "CHEFS_HAT", refPrice: 300 },
  { level: 12, lane: "PREMIUM", type: "TOKA_FEED", amount: 75, refPrice: 75 },
  { level: 14, lane: "PREMIUM", type: "ACCESSORY", accessoryType: "HELMET", refPrice: 400 },
  { level: 16, lane: "PREMIUM", type: "EGG", eggRarity: "RARE", refPrice: 400 },
  { level: 18, lane: "PREMIUM", type: "TOKA_FEED", amount: 100, refPrice: 100 },
  { level: 20, lane: "PREMIUM", type: "ACCESSORY", accessoryType: "HERO_CAPE", refPrice: 600 },
  { level: 23, lane: "PREMIUM", type: "TOKA_FEED", amount: 75, refPrice: 75 },
  { level: 26, lane: "PREMIUM", type: "EGG", eggRarity: "RARE", refPrice: 400 },
  { level: 28, lane: "PREMIUM", type: "TOKA_FEED", amount: 75, refPrice: 75 },
  { level: 30, lane: "PREMIUM", type: "ACCESSORY", accessoryType: "AURORA_CAPE", refPrice: 1500, exclusive: true },
];

/** Temporada 1 completa (estado que muestran los mockups: nivel 12, 320/500 XP). */
export const SEASON_1: PassSeason = {
  seasonLabel: "TEMPORADA 1",
  title: "Pase de Batalla",
  place: "Bosque de Toka",
  daysLeft: 12,
  tf: 50,
  level: 12,
  xpCurrent: 320,
  xpMax: 500,
  totalTiers: 30,
  isPremium: false,
  premiumPrice: 1500,
  premiumSummary: "13 recompensas + Capa Aurora",
  rewards: REWARDS,
};
