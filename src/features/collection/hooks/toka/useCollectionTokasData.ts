import { useCallback } from 'react'
import useSWR from 'swr'
import type { ColFilter, CollectionTokagotchiData, CollectionTokasState } from '../../types/collection.types'
import { collectionKeys } from '../../swr/keys'
import { playerApi } from '@/shared/api/player.api' 
import { favoritesApi } from '../../api/favorites.api'
import { mapTokaDtoListToColRoster } from '../../mappers/toka/toka.dto-to-domain.mapper'

const PAGE_SIZE = 20

export function useCollectionTokasData(page: number, filter: ColFilter) {

  const { data, error, mutate } = useSWR<CollectionTokagotchiData, Error>(
    collectionKeys.tokas(page, PAGE_SIZE, filter),
    async (): Promise<CollectionTokagotchiData> => {
      const [paged, profile] = await Promise.all([
        playerApi.getMyTokagotchis(page, PAGE_SIZE),
        playerApi.getMe(),
      ])

      const roster = mapTokaDtoListToColRoster(paged.content)
      const activeTokagotchi = profile.mainTokagotchi

      return {
        activeTokaId: activeTokagotchi?.id ?? null,
        activeTokagotchi,
        roster,
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
  )

  const state: CollectionTokasState = error
    ? { status: 'error', error: error instanceof Error ? error.message : 'Error al cargar' }
    : !data
      ? { status: 'loading' }
      : { status: 'ready', data }

  const activate = useCallback(async (tokaId: string) => {
    await mutate(
      async (prev) => {
        const activeTokagotchi = await playerApi.setMyActiveTokagotchi(tokaId)
        if (!prev) return prev
        return {
          ...prev,
          activeTokaId: tokaId,
          activeTokagotchi,
        }
      }
    )
  }, [mutate])

  const setFavorite = useCallback(async (tokaId: string, fav: boolean) => {
    await mutate(
      async (prev) => {
        await favoritesApi.setFavorite(tokaId, fav)
        return prev
          ? {
            ...prev,
            roster: prev.roster.map((t) => (t.id === tokaId ? { ...t, fav } : t)),
          }
          : prev
      }
    )
  }, [mutate])

  return {
    state,
    activate,
    setFavorite,
    reload: () => mutate(),
  }
}
