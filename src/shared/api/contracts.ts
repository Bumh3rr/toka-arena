import type { AscendResponseDTO, CareActionDTO, CareResponseDTO } from "@/shared/api/dto/tokagotchi-responses.dto";
import type { TokagotchiDTO } from "./dto/tokagotchi.dto";

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
