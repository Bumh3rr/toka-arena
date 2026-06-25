import type { CareDTO, EquippedAccessoryDTO, EvolutionDTO, TokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto";
import type { EquippedAccessory } from "../accessory";
import { getRenderBinding } from "@/shared/render/accessoryManifest";
import type { CareTimestamps, Tokagotchi, Stats } from "../tokagotchi";
import { toMs } from "@/shared/utils/time";
import type { Evolution } from "../evolution";

/**
 * Transforma DTOs de accesorios equipados a domain types.
 * - Busca renderBinding para cada accesorio
 * - Filtra si no existe binding y avisa en console
 * - Añade displayIndex del binding
 * @param dtos - Array de accesorios equipados del DTO
 * @returns Array de accesorios con renderBinding info
 */
export function mapEquippedDTO(dtos: EquippedAccessoryDTO[]): EquippedAccessory[] {
  return dtos.flatMap((dto) => {
    const binding = getRenderBinding(dto.code);
    if (!binding) {
      console.warn(
        `[accessories] sin binding de render para code="${dto.code}"`,
      );
      return [];
    }
    return [{ ...dto, displayIndex: binding.displayIndex }];
  });
}

/**
 * Transforma cooldowns ISO 8601 a milisegundos.
 * @param c - DTO con timestamps ISO de cooldowns
 * @returns Cooldowns en ms: { feed, play, bathe }
 */
export const mapCareDTO = (c: CareDTO): CareTimestamps => ({
  feed: toMs(c.feedAvailableAt),
  play: toMs(c.playAvailableAt),
  bathe: toMs(c.batheAvailableAt),
});

/**
 * Transforma datos de evolución a domain type.
 * Si null, retorna null. Sino, convierte evolvedAvailableAt a ms.
 * @param e - DTO de evolución o null si está en rareza máxima
 * @returns Domain Evolution o null
 */
export const mapEvolutionDTO = (e: EvolutionDTO | null): Evolution | null =>
  e
    ? {
        nextRarity: e.nextRarity,
        cpRequired: e.cpRequired,
        tfRequired: e.tfRequired,
        successChance: e.successChance,
        failCooldownHours: e.failCooldownHours,
        evolvedAvailableAt: toMs(e.evolvedAvailableAt),
      }
    : null

/**
 * Mapea tokagotchi activo completo desde DTO.
 * Orquestadora: compone stats, evolution, equipped, careCooldown usando mappers específicos.
 * @param dto - DTO del tokagotchi home
 * @returns Domain Tokagotchi con todos los datos transformados
 */
export function mapTokagotchiDTO(dto: TokagotchiDTO): Tokagotchi {
  return {
    id: dto.id,
    name: dto.name,
    species: dto.species,
    rarity: dto.rarity,
    cp: dto.cp,
    stats: mapStatsDTO(dto),
    nextEvolution: dto.nextEvolution ? mapEvolutionDTO(dto.nextEvolution) : null,
    equipped: dto.equipped ? mapEquippedDTO(dto.equipped) : [],
    careCooldown: mapCareDTO(dto.careCooldown),
  };
}

export function mapStatsDTO(dto: TokagotchiDTO): Stats {
  return { hp: dto.hp, atk: dto.atk, def: dto.def };
}