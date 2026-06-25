import type { AscendResponseDTO, CareActionDTO, CareResponseDTO } from "@/shared/api/dto/tokagotchi-responses.dto";
import type { HomeResponseDTO } from "./dto/home.dto";
import type { PlayerProfile } from "../domain/player";
import type { AuthResponseDTO } from "./dto/auth.dto";
import type { TokagotchiDTO } from "./dto/tokagotchi.dto";
import type { PlayerTokagotchisPageDTO } from "./dto/player.dto";
import type { Tokagotchi } from "../domain/tokagotchi";

/**
 * Contrato para todas las operaciones relacionadas con el Tokagotchi.
 * Métodos para cuidado, renombrado y evolución.
 */
export interface TokagotchiApi {
  /**
   * Ejecuta una acción de cuidado (alimentar, jugar, bañar)
   * @param tokaId - ID del tokagotchi
   * @param action - Tipo de acción: "FEED" | "PLAY" | "BATHE"
   * @returns Respuesta con CP ganado, cooldowns actualizados y misiones
   */
  care(tokaId: string, action: CareActionDTO): Promise<CareResponseDTO>;

  /**
   * Renombra el tokagotchi
   * @param tokaId - ID del tokagotchi
   * @param name - Nuevo nombre
   * @returns Tokagotchi actualizado con el nuevo nombre
   */
  rename(tokaId: string, name: string): Promise<TokagotchiDTO>;

  /**
   * Intenta evolucionar (ascender) el tokagotchi a la siguiente rareza
   * @param tokaId - ID del tokagotchi
   * @returns Resultado (SUCCESS/FAIL), nueva rareza, stats y TF consumido
   */
  ascend(tokaId: string): Promise<AscendResponseDTO>;
}

/**
 * Contrato para obtener datos de la pantalla Home.
 */
export interface HomeApi {
  /**
   * Obtiene datos completos de la pantalla home
   * @returns serverTime, misiones claimables, perfil del jugador y tokagotchi activo
   */
  getHome(): Promise<HomeResponseDTO>;
}

/**
 * Contrato para operaciones de sesión del jugador autenticado.
 */
export interface PlayerApi {
  /**
   * Obtiene el perfil actual del jugador autenticado.
   * @returns Perfil del jugador en formato de dominio
   */
  getMe(): Promise<PlayerProfile>;

  /**
   * Renombra el username del jugador autenticado.
   * @param newUsername - Nuevo username del jugador
   * @returns Perfil del jugador actualizado
   */
  renamePlayerUsername(newUsername: string): Promise<PlayerProfile>;

  /**
   * Obtiene la lista paginada de tokagotchis del jugador autenticado.
   * @param page - Índice de página (base 0)
   * @param size - Tamaño de página
   */
  getMyTokagotchis(page: number, size: number): Promise<PlayerTokagotchisPageDTO>;

  /**
   * Establece el tokagotchi activo del jugador autenticado.
   */
  setMyActiveTokagotchi(tokagotchiId: string): Promise<Tokagotchi>;
}

/**
 * Contrato para autenticación por código (OAuth/bridge).
 */
export interface AuthApi {
  /**
   * Realiza login con un authCode emitido por el proveedor de autenticación.
   * @param authCode - Código de autorización temporal
   * @returns Tokens y datos mínimos de sesión
   */
  login(authCode: string): Promise<AuthResponseDTO>;
}