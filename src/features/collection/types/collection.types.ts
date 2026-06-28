import type { TokagotchiDTO } from '@/shared/api/dto/tokagotchi.dto'
import type { Rarity, Tokagotchi } from '@/shared/domain/tokagotchi'


export type ColTab = 'toka' | 'acc' | 'reactions'
export type ColFilter = 'all' | Rarity | 'fav'
export type AccSlotKey = 'cabeza' | 'cuerpo' | 'cara' | 'espalda'
export type AccSlotFilter = AccSlotKey | 'todos'

export interface ColAbility {
  name: string
  nrg: number
  desc: string
  signature: boolean
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
  activeTokagotchi: TokagotchiDTO | null
  roster: TokagotchiDTO[]
  accessories: ColAcc[]
  lockedSpecies: ColLockedSpecies[]
  speciesTotal: number
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export interface CollectionData {
  serverTime: number
  activeTokaId: string
  activeTokagotchi: Tokagotchi | null
  roster: Tokagotchi[]
  accessories: ColAcc[]
  lockedSpecies: ColLockedSpecies[]
  speciesTotal: number
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export interface CollectionTokagotchiData {
  serverTime: number
  tf: number
  activeTokaId: string | null
  activeTokagotchi: Tokagotchi | null
  roster: Tokagotchi[]
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export type CollectionState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: T }

export type CollectionTokasState = CollectionState<CollectionTokagotchiData>

export interface CollectionUi {
  tab: ColTab
  filter: ColFilter
  group: boolean
  detailId: string | null
  expandedAbility: number | null
  accSlot: AccSlotFilter
}
