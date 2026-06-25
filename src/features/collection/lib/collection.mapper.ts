import type { CollectionData, CollectionResponseDTO } from '../types/collection.types'

export function mapCollectionDTO(dto: CollectionResponseDTO): CollectionData {
  return {
    serverTime: new Date(dto.serverTime).getTime(),
    activeTokaId: dto.activeTokaId,
    activeTokagotchi: dto.activeTokagotchi,
    roster: dto.roster,
    accessories: dto.accessories,
    lockedSpecies: dto.lockedSpecies,
    speciesTotal: dto.speciesTotal,
    pagination: dto.pagination,
  }
}