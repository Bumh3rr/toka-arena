import type { AnimationTokagotchi } from "@/shared/domain/tokagotchi";
import type { PlayerProfile } from "@/shared/player/data/player";

/**
 * Tipos de acciones de cuidado disponibles para el tokagotchi.
 * - "feed": Alimentar (gana CP, reduce hambre)
 * - "play": Jugar (gana CP, aumenta felicidad)
 * - "bathe": Bañar (gana CP, aumenta higiene)
 */
export type ActionCare = "feed" | "play" | "bathe";

/**
 * Configuración por tipo de acción de cuidado.
 * Define label UI, CP ganado, cooldown, imagen y animación.
 */
export interface ConfigCare {
  /** Identificador: "feed", "play", "bathe" */
  key: ActionCare;
  /** Texto para mostrar en UI: "Alimentar", "Jugar", "Bañar" */
  label: string;
  /** CP que gana al completar la acción */
  cp: number;
  /** Cooldown en segundos antes de poder repetir */
  cooldownSeg: number;
  /** Path a imagen de la acción */
  img: string;
  /** Animación que se toca al realizar la acción */
  animation: AnimationTokagotchi;
}

/**
 * Estado completo de la pantalla Home.
 * Contiene tiempo del servidor, misiones y perfil del jugador.
 */
export interface HomeData {
  /** Misiones disponibles para el jugador */
  missions: { claimable: number };
  /** Perfil del jugador con tokagotchi activo */
  player: PlayerProfile;
}