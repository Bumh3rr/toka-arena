import type { CareResponseDTO, AscendResponseDTO } from "@/shared/api/dto/tokagotchi-responses.dto";
import type { HomeData } from "./home.types";
import { mapCareDTO, mapEvolutionDTO, mapStatsDTO } from "@/shared/domain/mappers/tokagotchi.mapper";

/**
 * Reconcilia respuesta de rename con HomeData.
 * Actualiza solo el nombre del tokagotchi activo.
 * @param prev - HomeData anterior
 * @param name - Nuevo nombre del tokagotchi
 * @returns HomeData actualizado con el nuevo nombre
 */
export function applyRename(prev: HomeData, name: string): HomeData {
  if (!prev.player) return prev;
  return {
    ...prev, player: {
      ...prev.player,
      mainTokagotchi: prev.player.mainTokagotchi ? { ...prev.player.mainTokagotchi, name } : null,
    },
  };
}

/**
 * Reconcilia respuesta de acción de cuidado con HomeData.
 * Actualiza: CP ganado, cooldowns, misiones, serverTime.
 * @param prev - HomeData anterior
 * @param res - Respuesta del servidor tras care (feed/play/bathe)
 * @returns HomeData reconciliado con nuevos valores
 */
export function applyCareResponse(
  prev: HomeData,
  res: CareResponseDTO,
): HomeData {
  if (!prev.player) return prev;
  return {
    ...prev,
    missions: { claimable: prev.missions.claimable + 1 }, // TODO: esto debería venir del backend, no sumarlo aquí
    player: {
      ...prev.player,
      serverTime: new Date(res.serverTime).getTime(),
      mainTokagotchi: prev.player.mainTokagotchi ? {
          ...prev.player.mainTokagotchi,
          cp: res.tokagotchi.cp,
          careCooldown: mapCareDTO(res.caresAvailableAt),
        }
      : null,
    },
  };
}

/**
 * Reconcilia respuesta de ascenso (evolución) con HomeData.
 * Actualiza: rareza, cp, stats, nextEvolution disponible, serverTime.
 * Se toca cuando el ascenso es SUCCESS o FAIL.
 * @param prev - HomeData anterior
 * @param res - Respuesta del servidor tras ascend
 * @returns HomeData reconciliado con nuevos valores de evolución
 */
export function applyAscendResponse(prev: HomeData, res: AscendResponseDTO): HomeData {
  if (!prev.player) return prev;
  return {
    ...prev,
    player: {
      ...prev.player,
      mainTokagotchi: prev.player.mainTokagotchi ? {
        ...prev.player.mainTokagotchi,
        rarity: res.tokagotchi.rarity,
        cp: res.tokagotchi.cp,
        stats: mapStatsDTO(res.tokagotchi),
        nextEvolution: mapEvolutionDTO(res.tokagotchi.nextEvolution),
      } : null,
    },
  };
}
