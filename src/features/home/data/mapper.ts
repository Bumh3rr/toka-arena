import type { HomeData } from "./types";
import type { HomeResponseDTO, ActiveTokaDTO, EvolutionDTO, CareDTO, CareResponseDTO, AscendResponseDTO } from "./dto";
import type { EquippedAccessory, EquippedAccessoryDTO } from "@/shared/model/accessory";
import type { TokagotchiActive, CareTimestamps } from "@/shared/model/tokagotchi";
import type { Evolution } from "@/shared/model/evolution";
import { getRenderBinding } from "@/shared/render/accessoryManifest";
import { getAssetsBySpecies } from "@/shared/libs/tokagotchi";
import { toMs } from "@/shared/libs/time";

function mapEquipped(dtos: EquippedAccessoryDTO[]): EquippedAccessory[] {
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
const mapCare = (c: CareDTO): CareTimestamps => ({
  feed: toMs(c.feedAvailableAt),
  play: toMs(c.playAvailableAt),
  bathe: toMs(c.batheAvailableAt),
});
const mapEvolution = (e: EvolutionDTO | null): Evolution | null =>
  e ? { ...e, availableAt: toMs(e.availableAt) } : null;

function mapActiveToka(t: ActiveTokaDTO): TokagotchiActive {
  return {
    id: t.id,
    name: t.name,
    species: t.species,
    rarity: t.rarity,
    cp: t.cp,
    stats: t.stats,
    abilities: t.abilities,
    equipped: mapEquipped(t.equipped),
    evolution: mapEvolution(t.evolution),
    assets: getAssetsBySpecies(t.species),
    care: mapCare(t.care),
  };
}
export function mapHome(dto: HomeResponseDTO): HomeData {
  return {
    serverTime: new Date(dto.serverTime).getTime(),
    missions: dto.missions,
    activeToka: dto.activeToka ? mapActiveToka(dto.activeToka) : null,
  };
}
export function applyRename(prev: HomeData, name: string): HomeData {
  if (!prev.activeToka) return prev;
  return { ...prev, activeToka: { ...prev.activeToka, name } };
}

export function applyCareResponse(
  prev: HomeData,
  res: CareResponseDTO,
): HomeData {
  if (!prev.activeToka) return prev;
  return {
    ...prev,
    serverTime: new Date(res.serverTime).getTime(),
    missions: res.missions,
    activeToka: { ...prev.activeToka, cp: res.cp, care: mapCare(res.care) },
  };
}

export function applyAscendResponse(prev: HomeData, res: AscendResponseDTO): HomeData {
  if (!prev.activeToka) return prev;
  return {
    ...prev,
    serverTime: new Date(res.serverTime).getTime(),
    activeToka: {
      ...prev.activeToka,
      rarity: res.toka.rarity,
      cp: res.toka.cp,
      stats: res.toka.stats,
      evolution: mapEvolution(res.toka.evolution),   // reusa el mapEvolution privado
    },
  };
}
