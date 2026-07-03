import type { Rarity, Tokagotchi } from '@/shared/domain/tokagotchi'

export type ColTab = 'toka' | 'acc' | 'reactions'
export type ColFilter = 'all' | Rarity | 'fav'

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
