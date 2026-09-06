import type { ColorVariant } from "@/shared/ui/Kit";

// ── Modos de juego ──────────────────────────────────────────────────────────

/** Modos de arena disponibles. Añadir uno = añadir su entrada en ARENA_MODES. */
export type ArenaMode = "NORMAL" | "BET";

/** Fases del flujo de arena. Hoy solo LOBBY está implementada. */
export type ArenaPhase = "LOBBY" | "MATCHMAKING" | "BATTLE" | "RESULT";

/** Recompensa que anuncia un modo en el selector. */
export interface ModeReward {
  /** Etiqueta corta que se pinta en el chip ("+60", "x2"). */
  label: string;
  /** Icono del chip: la moneda TF o el rayo de XP. */
  kind: "tf" | "xp" | "risk";
}

/**
 * Aura del piso de la arena. El lobby la pinta como una elipse radial sobre
 * el suelo del fondo, así que cada modo se siente distinto sin tocar el CSS.
 */
export interface ModeAura {
  /** Color del centro del resplandor. */
  glow: string;
  /** Color del borde del resplandor, donde se difumina hacia el fondo. */
  glowSoft: string;
  /** Tinte que envuelve el escenario completo. */
  tint: string;
  /** Brasas ascendentes (solo tiene sentido en arenas volcánicas). */
  embers: boolean;
}

/** Todo lo que cambia entre un modo y otro, como dato. */
export interface ArenaModeTheme {
  id: ArenaMode;
  label: string;
  /** Frase corta bajo el título en el selector. */
  tagline: string;
  /** Fondo a pantalla completa del lobby. */
  background: string;
  /** Banner apaisado del modo en el selector. */
  banner: string;
  /** Copa del modo: se usa en el botón del lobby y flotando sobre el banner. */
  cup: string;
  aura: ModeAura;
  /** Acento del modo — borde de selección, chips y CTA. */
  accent: ColorVariant;
  cta: {
    label: string;
    /** Subtítulo del CTA cuando el modo sí se puede jugar. */
    hint: string;
  };
  rewards: ModeReward[];
  /** false ⇒ el modo se puede previsualizar pero no se puede pelear. */
  enabled: boolean;
}

// ── Pociones ────────────────────────────────────────────────────────────────

export type PotionId =
  | "LESSER_HEALING"
  | "GREATER_HEALING"
  | "FURY_ELIXIR"
  | "IRON_SHIELD"
  | "ENERGY_BREW"
  | "PURIFICATION_TONIC";

export interface Potion {
  id: PotionId;
  name: string;
  /** Efecto en una línea, para el slot y el futuro panel de pociones. */
  description: string;
  image: string;
  /** Color del anillo del slot. */
  tint: string;
}

/** Una de las tres ranuras de poción que el jugador lleva al combate. */
export interface PotionSlot {
  index: number;
  potion: Potion | null;
}

// ── Estado del lobby ────────────────────────────────────────────────────────

export interface Stamina {
  current: number;
  max: number;
  /** Timestamp (ms) en que entra el siguiente punto. null si ya está llena. */
  nextRefillAt: number | null;
  /** Costo en TF de rellenar la barra completa. */
  fullRefillCostTF: number;
}

export interface BattleRecord {
  wins: number;
  losses: number;
}

/** Datos de arena que hoy salen del mock y mañana saldrán del backend. */
export interface ArenaLobbyData {
  stamina: Stamina;
  record: BattleRecord;
  potions: PotionSlot[];
}

/** Costo en estamina de entrar a un combate. */
export const STAMINA_PER_BATTLE = 1;
