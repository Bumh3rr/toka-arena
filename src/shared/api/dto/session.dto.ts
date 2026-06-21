import type { EvolutionDTO, RarityDTO, SpeciesDTO } from "./tokagotchi.dto";

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
  mainTokagotchi: MainTokagotchiDTO | null;
}

/**
 * Datos básicos del Tokagotchi activo del jugador,
 * incluidos en la respuesta de /players/me.
 */
export interface MainTokagotchiDTO {
  /** Identificador único del Tokagotchi. */
  id: string;
  /** Nombre personalizado del Tokagotchi. */
  name: string;
  /** Especie del Tokagotchi (TOFU, MOCHI, HANA). */
  species: SpeciesDTO;
  /** Rareza actual del Tokagotchi. */
  rarity: RarityDTO;
  /** Puntos de combate acumulados. */
  cp: number;
  /** Puntos de vida base. */
  hp: number;
  /** Ataque base. */
  atk: number;
  /** Defensa base. */
  def: number;
  /** Datos de evolución pendiente, o null si está en rareza máxima. */
  evolution: EvolutionDTO | null;
}