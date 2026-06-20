import type { Rarity, Species } from '@/shared/model/tokagotchi'

// La colección usa las especies reales del juego (las que tienen arte + soporte de canvas).
export type ColSpecies = Species

export const COL_SPECIES_LABEL: Record<ColSpecies, string> = {
  TOFU: 'Tofu',
  MOCHI: 'Mochi',
  HANA: 'Hana',
}

export type ColTab = 'toka' | 'acc'
export type ColFilter = 'all' | Rarity | 'fav'
export type AccSlotKey = 'cabeza' | 'cuerpo' | 'cara' | 'espalda'
export type AccSlotFilter = AccSlotKey | 'todos'

export interface ColAbility {
  name: string
  nrg: number
  desc: string
  signature: boolean
}

export interface ColToka {
  id: string
  nick: string
  species: ColSpecies
  rarity: Rarity
  fav: boolean
  origin: string
  cp: number
  stats: { hp: number; atk: number; def: number; nrg: number }
  abilities: ColAbility[]
  equippedHead: string | null   // acc id
  equippedBody: string | null   // acc id
}

export interface ColAcc {
  id: string
  name: string
  slot: AccSlotKey
  owned: number
  equipped: string[]      // toka ids
  locked: boolean
  code: string | null     // código de render (HELMET/CROWN/HAT/SUPER_CAPE); null si está bloqueado
  image: string | null    // ruta del PNG del catálogo; null si está bloqueado
}

export interface ColLockedSpecies {
  key: string
}

export interface CollectionResponseDTO {
  serverTime: string
  activeTokaId: string
  roster: ColToka[]
  accessories: ColAcc[]
  lockedSpecies: ColLockedSpecies[]
  speciesTotal: number
}

export interface CollectionData {
  serverTime: number
  activeTokaId: string
  roster: ColToka[]
  accessories: ColAcc[]
  lockedSpecies: ColLockedSpecies[]
  speciesTotal: number
}

export type CollectionState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: CollectionData }

export interface CollectionUi {
  tab: ColTab
  filter: ColFilter
  group: boolean
  detailId: string | null
  expandedAbility: number | null
  accSlot: AccSlotFilter
}
