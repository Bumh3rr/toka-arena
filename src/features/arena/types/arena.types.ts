import type { ColorVariant } from "@/shared/ui/Kit";
import type { Rarity, Species } from "@/shared/domain/tokagotchi";

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

// ── Búsqueda de rival y volado de iniciativa ────────────────────────────────

/**
 * Fases de la sección de búsqueda.
 *
 * `FLIGHT` cubre el giro y la caída de la moneda: es un solo vuelo animado, y
 * el rótulo cambia con la bandera `landing` del estado.
 */
export type MatchmakingPhase =
  | "SEARCHING"
  | "FOUND"
  | "FLIGHT"
  | "RESULT"
  | "EMPTY"
  | "ERROR";

/**
 * Un combatiente tal como se presenta antes de la batalla.
 *
 * `username` y `rarity` son opcionales a propósito: de nuestro lado salen de
 * `usePlayer()`, pero del rival el backend solo manda `name` y `species` en
 * `FighterStateResponse`. La tarjeta pinta las partes que existan.
 */
export interface MatchFighter {
  /** Nombre del Tokagotchi. */
  name: string;
  species: Species;
  /** Dueño del Tokagotchi. Del rival, hasta que el backend lo exponga. */
  username?: string;
  /** Del rival, hasta que el backend la exponga. */
  rarity?: Rarity;
}

/** Emparejamiento resuelto: los dos combatientes y quién abre el combate. */
export interface MatchFound {
  battleId: string;
  me: MatchFighter;
  rival: MatchFighter;
  /**
   * true si el jugador ataca primero. Lo decide el servidor comparando SPD
   * (volado real solo si empatan), y ya viene resuelto en `match-found`: la
   * moneda de la UI presenta esa respuesta, no la sortea.
   */
  firstIsMe: boolean;
}

/** Desenlace de una búsqueda. Es lo que el driver le entrega al hook. */
export type MatchmakingOutcome =
  | { kind: "matched"; battleId: string; rival: MatchFighter; firstIsMe: boolean }
  | { kind: "empty" }
  | { kind: "error"; message: string };

/** Búsqueda en curso, para poder abandonarla. */
export interface SearchHandle {
  cancel: () => void;
}

/**
 * Fuente de emparejamientos.
 *
 * Hoy la implementa `matchmakingMock`; mañana la implementará el cliente STOMP
 * (`POST /matchmaking/queue` + `/user/queue/match-found`). Es el único archivo
 * que cambia: ninguna vista de la sección conoce el transporte.
 */
export interface MatchmakingDriver {
  search(callbacks: {
    /** Tamaño de la cola, para el contador de espera. */
    onQueue: (playersInQueue: number) => void;
    /** Se llama una sola vez por búsqueda. */
    onOutcome: (outcome: MatchmakingOutcome) => void;
  }): SearchHandle;
}
