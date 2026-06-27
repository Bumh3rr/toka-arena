import { useMemo } from 'react'
import useSWR from 'swr'
import type { AccSlotFilter, CollectionData } from '../../types/collection.types'
import { collectionKeys } from '../../swr/keys'
import { playerApi } from '@/shared/player/api/player.api'
import {  mapTokaDtoListToColRoster } from '../../mappers/toka/toka.dto-to-domain.mapper'
import { mapRosterToAccessories } from '../../mappers/accessories/accessories.dto-to-domain.mapper'

const PAGE_SIZE = 100

export const SLOT_CHIPS: { key: AccSlotFilter; label: string; future?: boolean }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'cabeza', label: 'Cabeza' },
  { key: 'cuerpo', label: 'Cuerpo' },
  { key: 'cara', label: 'Cara (proximo)' },
  { key: 'espalda', label: 'Espalda (proximo)' },
]

export function useCollectionAccessoriesData(slotFilter: AccSlotFilter) {
  const { data, error, mutate } = useSWR<CollectionData>(
    collectionKeys.accessories(slotFilter),
    async () => {
      const [paged, profile] = await Promise.all([
        playerApi.getMyTokagotchis(0, PAGE_SIZE),
        playerApi.getMe(),
      ])

      const roster = mapTokaDtoListToColRoster(paged.content)
      const activeTokagotchi = profile.mainTokagotchi

      return {
        serverTime: Date.now(),
        activeTokaId: activeTokagotchi?.id ?? '',
        activeTokagotchi,
        roster,
        accessories: mapRosterToAccessories(roster, activeTokagotchi),
        lockedSpecies: [],
        speciesTotal: 0,
        pagination: {
          page: 0,
          size: PAGE_SIZE,
          totalElements: paged.totalElements,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      }
    },
  )

  const view = useMemo(() => {
    if (!data) {
      return {
        owned: 0,
        total: 0,
        pct: 0,
        visibleAccessories: [],
      }
    }

    const owned = data.accessories.filter((a) => !a.locked).length
    const total = data.accessories.length
    const pct = total > 0 ? Math.round((owned / total) * 100) : 0
    const visibleAccessories = slotFilter === 'todos'
      ? data.accessories
      : data.accessories.filter((a) => a.slot === slotFilter)

    return {
      owned,
      total,
      pct,
      visibleAccessories,
    }
  }, [data, slotFilter])

  return {
    data,
    view,
    isLoading: !data && !error,
    error,
    reload: () => mutate(),
  }
}
