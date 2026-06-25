import { useCallback, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { collectionApi } from '../api/collection.api'
import type { CollectionData, CollectionState } from '../types/collection.types'
import { mapCollectionDTO } from '../lib/collection.mapper.ts'

const PAGE_SIZE = 20

export function useCollectionTokas() {
  const { mutate: globalMutate } = useSWRConfig()
  const [page, setPage] = useState(0)

  const { data, error, mutate } = useSWR<CollectionData>(['collection', page, PAGE_SIZE], async () => {
    const dto = await collectionApi.getCollection(page, PAGE_SIZE)
    return mapCollectionDTO(dto)
  })

  const state: CollectionState = error
    ? { status: 'error', error: error instanceof Error ? error.message : 'Error al cargar' }
    : !data
      ? { status: 'loading' }
      : { status: 'ready', data }

  const activate = useCallback(async (tokaId: string) => {
    await mutate(
      async (prev) => {
        await collectionApi.activate(tokaId)
        if (!prev) return prev
        const activeTokagotchi = prev.roster.find((t) => t.id === tokaId) ?? prev.activeTokagotchi ?? null
        return { ...prev, activeTokaId: tokaId, activeTokagotchi }
      },
      {
        optimisticData: (prev) => {
          if (!prev) return prev!
          const activeTokagotchi = prev.roster.find((t) => t.id === tokaId) ?? prev.activeTokagotchi ?? null
          return { ...prev, activeTokaId: tokaId, activeTokagotchi }
        },
        revalidate: false,
        rollbackOnError: true,
      },
    )
    await globalMutate('me')
    await globalMutate('home')
  }, [mutate, globalMutate])

  const toggleFav = useCallback(async (tokaId: string, fav: boolean) => {
    await mutate(
      async (prev) => {
        await collectionApi.toggleFav(tokaId, fav)
        return prev
          ? { ...prev, roster: prev.roster.map((t) => t.id === tokaId ? { ...t, fav } : t) }
          : prev
      },
      {
        optimisticData: (prev) =>
          prev
            ? { ...prev, roster: prev.roster.map((t) => t.id === tokaId ? { ...t, fav } : t) }
            : prev!,
        revalidate: false,
        rollbackOnError: true,
      },
    )
  }, [mutate])

  const goToNextPage = useCallback(() => {
    if (!data?.pagination.hasNext) return
    setPage((p) => p + 1)
  }, [data?.pagination.hasNext])

  const goToPrevPage = useCallback(() => {
    if (!data?.pagination.hasPrevious) return
    setPage((p) => Math.max(0, p - 1))
  }, [data?.pagination.hasPrevious])

  return {
    state,
    activate,
    toggleFav,
    goToNextPage,
    goToPrevPage,
    reload: () => mutate(),
  }
}