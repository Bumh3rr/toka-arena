import type { HomeResponseDTO } from "@/features/home/api/dto/home.dto";
import type { HomeData } from "./home.types";
import { mapPlayerProfileDTO } from "@/shared/player/data/player.mapper";

/**
 * Envuelve mappers compartidos para convertir HomeResponseDTO a HomeData.
 * Compone: missions, player (usando mapper compartido).
 * @param dto - Respuesta del backend GET /home
 * @returns HomeData listo para consumir en el hook
 */
export function mapHomeResponseDTO(dto: HomeResponseDTO): HomeData {
  return {
    missions: {
      claimable: 1
    },
    player: mapPlayerProfileDTO(dto.player),
  };
}