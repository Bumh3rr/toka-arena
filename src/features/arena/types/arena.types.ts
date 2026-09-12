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

/**
 * Pociones de combate. Los identificadores son los de `PotionType` del
 * backend, literales: viajan tal cual en `POST /potions/equip` y en la acción
 * `POTION` del WebSocket, así que no admiten sinónimos.
 */
export type PotionId =
  | "MINOR_HEALTH"
  | "MAJOR_HEALTH"
  | "ENERGY_BREW"
  | "PURIFICATION_TONIC"
  | "WRATH_ELIXIR"
  | "IRON_SHIELD";

export interface Potion {
  id: PotionId;
  /** Nombre tal como lo escribe el backend (`PotionType.displayName`). */
  name: string;
  /** Efecto en una línea, para el slot y la hoja de pociones del combate. */
  description: string;
  image: string;
  /** Color del anillo del slot. */
  tint: string;
  /** Precio en TF, de `PotionType`. */
  price: number;
  /** Tope de unidades que se pueden llevar de esta poción a un combate. */
  limitPerBattle: number;
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

/**
 * Datos del lobby.
 *
 * Se quedó solo con la estamina: el historial y las pociones equipadas los
 * piden sus propias vistas cuando hacen falta, en vez de viajar todos juntos
 * en un paquete que el lobby tendría que recomponer.
 */
export interface ArenaLobbyData {
  stamina: Stamina;
}

/** Costo en estamina de entrar a un combate. */
export const STAMINA_PER_BATTLE = 1;

// ── Búsqueda de rival y volado de iniciativa ────────────────────────────────

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
 * La implementa `matchmakingDriver` sobre `POST /matchmaking/queue` y el canal
 * `/user/queue/match-found`. La interfaz existe para que ninguna vista de la
 * sección conozca el transporte: cambiarlo es cambiar un archivo.
 */
export interface MatchmakingDriver {
  search(callbacks: {
    /** Tamaño de la cola, para el contador de espera. */
    onQueue: (playersInQueue: number) => void;
    /** Se llama una sola vez por búsqueda. */
    onOutcome: (outcome: MatchmakingOutcome) => void;
  }): SearchHandle;
}

// ── Escenario de batalla ────────────────────────────────────────────────────

/** Habilidades de combate. Son los valores de `SkillType` del backend. */
export type SkillId =
  | "BITE"
  | "ROAR"
  | "GUARD"
  | "LOYALTY"
  | "CLAW"
  | "AGILITY"
  | "WEAKEN"
  | "FRENZY"
  | "TACKLE"
  | "BARK_SHIELD"
  | "REGENERATION"
  | "ANCESTRAL_FOREST";

export interface Skill {
  id: SkillId;
  species: Species;
  /** Nombre visible. Lo pone el front: el backend no tiene uno en español. */
  label: string;
  energyCost: number;
  /** Qué hace, en una línea, para la tarjeta. */
  effect: string;
  /** Las de 60 NRG. Se marcan aparte porque son la jugada de la especie. */
  isSignature: boolean;
}

/** Lo que un jugador puede hacer en su turno. */
export type BattleAction =
  | { type: "SKILL"; skill: SkillId }
  | { type: "POTION"; potion: PotionId }
  | { type: "REST" };

/** Momentos de la batalla que anuncia el servidor. */
export type BattleEventType =
  | "INICIO_BATALLA"
  | "ACCION"
  | "TIMEOUT"
  | "FIN_DE_BATALLA"
  | "ESTADO_ACTUAL";

/**
 * Un estado alterado o un buff activo, ya resuelto para pintarlo.
 *
 * El servidor manda un contador por efecto (`burnTurns`, `roarAtkBuffTurns`…);
 * `lib/battleStatus` los recoge en esta lista para que las vistas no tengan
 * que conocer los doce campos.
 */
export interface StatusEffect {
  id: string;
  label: string;
  /** Turnos que le quedan, o el HP restante en el caso del escudo de HANA. */
  amount: number;
  /** Si perjudica a quien lo lleva. Cambia el color de la etiqueta. */
  harmful: boolean;
}

/** Estado de un combatiente. Espejo de `FighterStateResponse`. */
export interface BattleFighter {
  playerId: string;
  /** Nombre del Tokagotchi, que es como lo nombra la narrativa del servidor. */
  name: string;
  species: Species;
  currentHp: number;
  maxHp: number;
  /** 0–100. */
  currentEnergy: number;
  currentSpd: number;
  /** Pociones que le quedan en este combate, por tipo. */
  potions: Partial<Record<PotionId, number>>;
  status: StatusEffect[];
}

/**
 * Estado completo de la batalla. Cada mensaje del servidor lo trae íntegro, no
 * como delta, así que se reemplaza entero sin mezclar nada.
 */
export interface BattleState {
  eventType: BattleEventType;
  battleId: string;
  /** Contador global. Desde el 15 empieza la fatiga; desde el 20 se duplica. */
  currentTurn: number;
  /** Quién puede actuar ahora. */
  activePlayerId: string;
  /** Unix ms. Al vencer, el servidor fuerza `REST` por su cuenta. */
  turnDeadlineMilli: number;
  /** Narrativa del último evento, ya redactada por el servidor. */
  lastActionDescription: string;
  fighters: Record<string, BattleFighter>;
}

/** Cómo terminó el combate, desde la perspectiva del jugador. */
export type BattleOutcome = "WIN" | "LOSS" | "DRAW";

/**
 * Desenlace tal como lo presenta la pantalla de resultados.
 *
 * `ABANDON` no es un estado del backend: se deduce de que la batalla haya
 * terminado con **los dos combatientes en pie**. `resolveAbandon` borra la
 * sesión sin tocar el HP de quien se va, así que nadie a cero solo puede
 * significar que el rival abandonó. Se separa de `WIN` porque paga lo mismo
 * pero no se gana igual, y la pantalla no debería celebrarlo igual.
 */
export type ResultKind = "WIN" | "LOSS" | "DRAW" | "ABANDON";

/** Lo que el combate le entrega a la pantalla de resultados. */
export interface BattleResult {
  kind: ResultKind;
  /** Turnos que duró. */
  turns: number;
  rivalName: string;
  /**
   * Saldo del jugador **antes** de que el servidor pagara.
   *
   * Se toma al empezar el combate, que es el único momento sin ambigüedad: el
   * servidor no manda las recompensas, así que la pantalla de resultados las
   * deduce comparando este saldo con el de después.
   */
  before: { tf: number; cp: number };
}

/**
 * Transporte de la batalla.
 *
 * Lo implementa `battleDriver` sobre `/app/battle/action` y
 * `/topic/battle/{id}`. La interfaz existe para que ninguna vista del
 * escenario conozca el transporte: cambiarlo es cambiar un archivo.
 */
export interface BattleDriver {
  /**
   * Se suscribe a la batalla. Llama a `onState` con cada estado íntegro que
   * llega, empezando por el actual.
   *
   * No informa de la conectividad: eso lo sabe el transporte, que vive a nivel
   * de app y no dentro de una batalla concreta.
   */
  connect(callbacks: {
    onState: (state: BattleState) => void;
    /** Texto plano del servidor: va a un toast, no a la lógica. */
    onError: (message: string) => void;
  }): { disconnect: () => void };

  /** Envía una acción. El resultado llega por `onState`, no aquí. */
  send(action: BattleAction): void;

  /** Abandona: derrota inmediata para quien se va. */
  surrender(): void;
}
