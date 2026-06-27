import type { PaginatedResponseDTO } from "@/shared/api/dto/pagination.dto"
import type { TokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto"

/**
 * Respuesta del endpoint GET /players/me.
 * Representa el perfil completo del jugador autenticado.
 */
export interface PlayerProfileDto {
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
}

export type PlayerTokagotchisPageDTO = PaginatedResponseDTO<TokagotchiDTO>