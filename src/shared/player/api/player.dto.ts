import type { PaginatedResponseDTO } from "@/shared/api/dto/pagination.dto"
import type { TokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto"

/**
 * Respuesta del endpoint GET /players/me.
 * Representa el perfil completo del jugador autenticado.
 */
export interface PlayerProfileDTO {
  serverTime: string
  /** Identificador único del jugador. */
  id: string;
  /** Nombre de usuario visible en la UI. */
  username: string;
  /** URL del avatar del jugador, o null si no tiene uno asignado. */
  avatarUrl: string | null;
  /** Saldo actual de TF (TokaFeed) del jugador. */
  tokafeed: number;
  /** Indica si el jugador ya reclamó su Tokagotchi de génesis. */
  genesisClaimed: boolean;
  /** Tokagotchi activo del jugador, o null si aún no tiene ninguno. */
  mainTokagotchi: TokagotchiDTO | null;
  /** Puntos de estamina de combate disponibles. El backend recalcula la
   *  regeneración pasiva en cada lectura de este endpoint. */
  currentStamina: number;
  /** Recargas de estamina compradas hoy. El backend permite 2. */
  dailyStaminaRefillsCount: number;
  /** Desde cuándo cuenta la regeneración del siguiente punto. */
  lastStaminaUpdate: string;
}

export type PlayerTokagotchisPageDTO = PaginatedResponseDTO<TokagotchiDTO>