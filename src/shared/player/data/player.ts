import type { Tokagotchi } from "@/shared/domain/tokagotchi";

/** Estamina de combate, tal como la lleva el backend. */
export interface PlayerStamina {
  /** Puntos disponibles ahora. */
  current: number;
  /** Recargas compradas hoy. */
  refillsToday: number;
  /** Momento (ms) desde el que cuenta el siguiente punto. */
  lastUpdate: number;
}

export interface PlayerProfile {
  serverTime: number;
  id: string;
  username: string;
  avatar: string | null;
  tf: number;
  genesisClaimed: boolean;
  mainTokagotchi: Tokagotchi | null;
  stamina: PlayerStamina;
  createdAt: number;
}
