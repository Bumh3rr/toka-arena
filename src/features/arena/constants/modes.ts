import type { ArenaMode, ArenaModeTheme } from "../types/arena.types";

/**
 * Catálogo de modos de arena.
 *
 * Es la columna vertebral del módulo: el lobby entero (fondo, aura del piso,
 * copa, acento del CTA) se pinta leyendo `ARENA_MODES[mode]`. Añadir un modo
 * nuevo es añadir una entrada aquí — ningún componente cambia.
 */
export const ARENA_MODES: Record<ArenaMode, ArenaModeTheme> = {
  NORMAL: {
    id: "NORMAL",
    label: "Normal",
    tagline: "Combate amistoso, sin nada que perder",
    background: "/assets/backgrounds/bg_mode_normal.jpeg",
    banner: "/assets/arena/ai_select_modes/mode_normal.svg",
    cup: "/assets/arena/cup/cup_mode_normal.png",
    aura: {
      glow: "rgba(255, 240, 203, .85)",
      glowSoft: "rgba(255, 232, 182, .38)",
      tint: "rgba(255, 233, 199, .18)",
      embers: false,
    },
    accent: "legend",
    cta: { label: "Batalla", hint: "1 estamina" },
    rewards: [
      { label: "+60", kind: "tf" },
      { label: "+25 XP", kind: "xp" },
    ],
    enabled: true,
  },

  BET: {
    id: "BET",
    label: "Apuesta",
    tagline: "Ganas el doble o lo pierdes todo",
    background: "/assets/backgrounds/bg_mode_bet.jpeg",
    banner: "/assets/arena/ai_select_modes/mode_bet.svg",
    cup: "/assets/arena/cup/cup_mode_bet.png",
    aura: {
      glow: "rgba(255, 146, 48, .78)",
      glowSoft: "rgba(214, 78, 20, .34)",
      tint: "rgba(120, 30, 10, .26)",
      embers: true,
    },
    accent: "danger",
    cta: { label: "Apostar", hint: "Mantén presionado" },
    rewards: [
      { label: "x2", kind: "tf" },
      { label: "Riesgo total", kind: "risk" },
    ],
    enabled: false,
  },
};

/** Orden en que se listan los modos en el selector. */
export const ARENA_MODE_ORDER: ArenaMode[] = ["NORMAL", "BET"];

/** Modo con el que abre el lobby. */
export const DEFAULT_ARENA_MODE: ArenaMode = "NORMAL";
