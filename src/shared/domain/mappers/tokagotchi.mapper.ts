import type { CareDTO, EvolutionDTO, TokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto";
import type { CareTimestamps, Tokagotchi, Stats, Evolution } from "../tokagotchi";
import { toMs } from "@/shared/utils/time";
import { mapEquipped } from "./equipped.mapper";

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
 * @param e - DTO de evolución
 * @returns Domain Evolution
 */
export const mapEvolutionDTO = (e: EvolutionDTO): Evolution => ({
  nextRarity: e.nextRarity,
  cpRequired: e.cpRequired,
  tfRequired: e.tfRequired,
  successChance: e.successChance,
  failCooldownHours: e.failCooldownHours,
  evolvedAvailableAt: toMs(e.evolvedAvailableAt),
});

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
    nextEvolution: mapEvolutionDTO(dto.nextEvolution),
    equipped: dto.equipped ? mapEquipped(dto.equipped) : [],
    careCooldown: mapCareDTO(dto.careCooldown),
  };
}

export function mapStatsDTO(dto: TokagotchiDTO): Stats {
  return { hp: dto.hp, atk: dto.atk, def: dto.def };
}