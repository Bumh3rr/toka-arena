export interface PassResponseDTO {
  serverTime: string;
  season: string;
  tier: number;
  totalTiers: number;
  isPremium: boolean;
  endsAt: string | null;
}
export interface Pass {
  serverTime: number; // ms
  season: string;
  tier: number;
  totalTiers: number;
  isPremium: boolean;
  endsAt: number | null; // ms
}


// Modelo de recompensas del pase (vista de diseño — datos estáticos locales).

/** Carril de la recompensa: gratuito o de pago */
export type PassLane = "FREE" | "PREMIUM";

/** Tipo de recompensa entregable en un nivel del pase */
export type RewardType = "TOKA_FEED" | "ACCESSORY" | "EGG";

/** Códigos de accesorios que puede otorgar el pase */
export type AccessoryType =
  | "HAT"
  | "GLASSES"
  | "MOUSTACHE"
  | "PATCH"
  | "CHEFS_HAT"
  | "HELMET"
  | "HERO_CAPE"
  | "AURORA_CAPE";

/** Rareza del huevo entregado */
export type EggRarity = "COMMON" | "RARE";

/** Estado visual de una recompensa según nivel actual y titularidad premium */
export type RewardStatus = "claimable" | "locked" | "claimed";

/** Una recompensa concreta en un nivel y carril del pase */
export interface PassReward {
  /** Nivel del pase en el que se otorga (1..totalTiers) */
  level: number;
  /** Carril al que pertenece */
  lane: PassLane;
  /** Tipo de recompensa */
  type: RewardType;
  /** Cantidad de Toka Feed (solo `TOKA_FEED`) */
  amount?: number;
  /** Accesorio otorgado (solo `ACCESSORY`) */
  accessoryType?: AccessoryType;
  /** Rareza del huevo (solo `EGG`) */
  eggRarity?: EggRarity;
  /** Valor de referencia en TF (para mostrar "· N TF") */
  refPrice: number;
  /** Marca la recompensa como exclusiva del pase (estilo destacado) */
  exclusive?: boolean;
}

/** Temporada completa del pase con su meta y su lista de recompensas */
export interface PassSeason {
  /** Etiqueta superior, ej. "TEMPORADA 1" */
  seasonLabel: string;
  /** Título grande, ej. "Pase de Batalla". */
  title: string;
  /** Lugar/ambientación, ej. "Bosque de Toka". */
  place: string;
  /** Días restantes de la temporada. */
  daysLeft: number;
  /** Saldo TF mostrado en la cabecera. */
  tf: number;
  /** Nivel actual del jugador. */
  level: number;
  /** XP acumulada dentro del nivel actual. */
  xpCurrent: number;
  /** XP necesaria para subir de nivel. */
  xpMax: number;
  /** Número total de niveles de la temporada. */
  totalTiers: number;
  /** Si el jugador ya compró el carril premium. */
  isPremium: boolean;
  /** Precio en TF para desbloquear premium. */
  premiumPrice: number;
  /** Resumen mostrado en la barra inferior, ej. "13 recompensas + Capa Aurora". */
  premiumSummary: string;
  /** Todas las recompensas de la temporada (ambos carriles). */
  rewards: PassReward[];
}
