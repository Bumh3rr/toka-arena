import type { TokagotchiDTO } from '@/shared/api/dto/tokagotchi.dto'
import type { CollectionResponseDTO, ColAbility, ColAcc } from '../types/collection.types'
import { playerApi } from '@/shared/api/player.api'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'

export interface CollectionApi {
  getCollection(page: number, size: number): Promise<CollectionResponseDTO>
  activate(tokaId: string): Promise<void>
  toggleFav(tokaId: string, fav: boolean): Promise<void>
}

// ── habilidades por especie ─────────────────────────────────────────────────────
// Tomadas del juego real (SPECIES_ABILITIES) y mapeadas a la forma de la colección.
const ABILITIES_TOFU: ColAbility[] = [
  { name: 'Mordida', nrg: 15, desc: 'Daño 1.0x Atk', signature: false },
  { name: 'Ladrido', nrg: 20, desc: '+15% Ataque por 2 turnos', signature: false },
  { name: 'Guardia', nrg: 25, desc: '-30% daño recibido el próximo turno', signature: false },
  { name: 'Lealtad', nrg: 45, desc: 'Daño 1.4x Atk. Si HP < 30%, cura 20% del daño causado', signature: true },
]
const ABILITIES_MOCHI: ColAbility[] = [
  { name: 'Zarpazo', nrg: 15, desc: 'Daño 0.9x Atk. 20% prob. de ignorar defensa', signature: false },
  { name: 'Agilidad', nrg: 25, desc: '25% prob. de esquivar el siguiente ataque', signature: false },
  { name: 'Bufido', nrg: 20, desc: 'Reduce Defensa del rival un 20%', signature: false },
  { name: 'Frenesí', nrg: 45, desc: '2 golpes de 0.7x Atk. En Legendario, 30% prob. de crítico (x1.5)', signature: true },
]
const ABILITIES_HANA: ColAbility[] = [
  { name: 'Florazo', nrg: 15, desc: 'Daño 1.0x Atk', signature: false },
  { name: 'Fotosíntesis', nrg: 20, desc: 'Recupera vitalidad y gana ritmo', signature: false },
  { name: 'Espinas', nrg: 25, desc: 'Aumenta defensa por 2 turnos', signature: false },
  { name: 'Tormenta de Pétalos', nrg: 45, desc: 'Daño 1.35x Atk', signature: true },
]

// ── catálogo base de accesorios (fase 1: visual local) ─────────────────────────
const BASE_ACCESSORIES: ColAcc[] = [
  { id: 'acc_helmet', name: 'Casco',      slot: 'cabeza', owned: 0, equipped: [], locked: false, code: 'HELMET',     image: '/assets/accesorios/casco.png' },
  { id: 'acc_crown',  name: 'Corona',     slot: 'cabeza', owned: 0, equipped: [], locked: false, code: 'CROWN',      image: '/assets/accesorios/corona.png' },
  { id: 'acc_hat',    name: 'Sombrero',   slot: 'cabeza', owned: 0, equipped: [], locked: false, code: 'HAT',        image: '/assets/accesorios/sombrero.png' },
  { id: 'acc_cape',   name: 'Super Capa', slot: 'cuerpo', owned: 0, equipped: [], locked: false, code: 'SUPER_CAPE', image: '/assets/accesorios/capa.png' },
  { id: 'acc_locked1', name: '???', slot: 'cara',    owned: 0, equipped: [], locked: true, code: null, image: null },
  { id: 'acc_locked2', name: '???', slot: 'espalda', owned: 0, equipped: [], locked: true, code: null, image: null },
]

const ABILITIES_BY_SPECIES: Record<string, ColAbility[]> = {
  TOFU: ABILITIES_TOFU,
  MOCHI: ABILITIES_MOCHI,
  HANA: ABILITIES_HANA,
}

const ACCESSORY_ID_BY_CODE: Record<string, string> = {
  HELMET: 'acc_helmet',
  CROWN: 'acc_crown',
  HAT: 'acc_hat',
  SUPER_CAPE: 'acc_cape',
}

const ACCESSORY_SLOT_BY_CODE: Record<string, 'cabeza' | 'cuerpo'> = {
  HELMET: 'cabeza',
  CROWN: 'cabeza',
  HAT: 'cabeza',
  SUPER_CAPE: 'cuerpo',
}

const favByTokaId = new Map<string, boolean>()

function mapEnergyByRarity(rarity: TokagotchiDTO['rarity']): number {
  switch (rarity) {
    case 'COMMON':
      return 60
    case 'RARE':
      return 80
    case 'EPIC':
      return 95
    case 'LEGENDARY':
      return 110
  }
}

function mapColToka(t: TokagotchiDTO): CollectionResponseDTO['roster'][number] {
  const equippedHead = t.equipped?.find((e) => ACCESSORY_SLOT_BY_CODE[e.code] === 'cabeza')
  const equippedBody = t.equipped?.find((e) => ACCESSORY_SLOT_BY_CODE[e.code] === 'cuerpo')

  return {
    id: t.id,
    nick: t.name,
    species: t.species,
    rarity: t.rarity,
    fav: favByTokaId.get(t.id) ?? false,
    origin: 'Colección',
    cp: t.cp,
    stats: {
      hp: t.hp,
      atk: t.atk,
      def: t.def,
      nrg: mapEnergyByRarity(t.rarity),
    },
    abilities: ABILITIES_BY_SPECIES[t.species] ?? [],
    equippedHead: equippedHead ? ACCESSORY_ID_BY_CODE[equippedHead.code] ?? null : null,
    equippedBody: equippedBody ? ACCESSORY_ID_BY_CODE[equippedBody.code] ?? null : null,
  }
}

function mapRoster(content: TokagotchiDTO[]): CollectionResponseDTO['roster'] {
  return content.map(mapColToka)
}

function mapColTokaFromDomain(t: Tokagotchi): CollectionResponseDTO['roster'][number] {
  const equippedHead = t.equipped?.find((e) => ACCESSORY_SLOT_BY_CODE[e.code] === 'cabeza')
  const equippedBody = t.equipped?.find((e) => ACCESSORY_SLOT_BY_CODE[e.code] === 'cuerpo')

  return {
    id: t.id,
    nick: t.name,
    species: t.species,
    rarity: t.rarity,
    fav: favByTokaId.get(t.id) ?? false,
    origin: 'Colección',
    cp: t.cp,
    stats: {
      hp: t.stats.hp,
      atk: t.stats.atk,
      def: t.stats.def,
      nrg: mapEnergyByRarity(t.rarity),
    },
    abilities: ABILITIES_BY_SPECIES[t.species] ?? [],
    equippedHead: equippedHead ? ACCESSORY_ID_BY_CODE[equippedHead.code] ?? null : null,
    equippedBody: equippedBody ? ACCESSORY_ID_BY_CODE[equippedBody.code] ?? null : null,
  }
}

function mapAccessories(
  roster: CollectionResponseDTO['roster'],
  activeTokagotchi: CollectionResponseDTO['activeTokagotchi'],
): CollectionResponseDTO['accessories'] {
  const accessories = structuredClone(BASE_ACCESSORIES)
  const source = activeTokagotchi && !roster.some((t) => t.id === activeTokagotchi.id)
    ? [...roster, activeTokagotchi]
    : roster

  for (const acc of accessories) {
    if (acc.locked) continue
    const equippedIds = source
      .filter((t) => t.equippedHead === acc.id || t.equippedBody === acc.id)
      .map((t) => t.id)

    acc.equipped = equippedIds
    acc.owned = equippedIds.length > 0 ? 1 : 0
  }

  return accessories
}

export const realCollectionApi: CollectionApi = {
  async getCollection(page, size) {
    const [paged, profile] = await Promise.all([
      playerApi.getMyTokagotchis(page, size),
      playerApi.getMe(),
    ])
    const roster = mapRoster(paged.content)
    const activeTokagotchi = profile.mainTokagotchi ? mapColTokaFromDomain(profile.mainTokagotchi) : null
    const activeTokaId = activeTokagotchi?.id ?? ''

    return {
      serverTime: new Date().toISOString(),
      activeTokaId,
      activeTokagotchi,
      roster,
      accessories: mapAccessories(roster, activeTokagotchi),
      lockedSpecies: [{ key: 'mystery' }],
      speciesTotal: 4,
      pagination: {
        page: paged.page,
        size: paged.size,
        totalElements: paged.totalElements,
        totalPages: paged.totalPages,
        hasNext: paged.hasNext,
        hasPrevious: paged.hasPrevious,
      },
    }
  },

  async activate(tokaId: string) {
    await playerApi.setMyActiveTokagotchi(tokaId)
  },

  async toggleFav(tokaId: string, fav: boolean) {
    // Fase 1: placeholder local hasta tener endpoint backend de favoritos.
    favByTokaId.set(tokaId, fav)
  },
}

export const collectionApi: CollectionApi = realCollectionApi
