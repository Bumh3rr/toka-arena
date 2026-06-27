import { useCallback, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { playerApi } from '@/shared/player/api/player.api'
import { mapTokagotchiDTO } from '@/shared/domain/mappers/tokagotchi.mapper'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'

const PAGE_SIZE = 20

interface CollectionModalData {
  activeId: string | null
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

type CollectionModalState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: CollectionModalData }

export function useCollectionModal() {
  const [page, setPage] = useState(0)
  const { mutate: globalMutate } = useSWRConfig()

  const { data, error, mutate, isValidating } = useSWR<CollectionModalData>(
    ['home.collection-modal', page, PAGE_SIZE],
    async () => {
      const [paged, profile] = await Promise.all([
        playerApi.getMyTokagotchis(page, PAGE_SIZE),
        playerApi.getMe(),
      ])

      return {
        activeId: profile.mainTokagotchi?.id ?? null,
        roster: paged.content.map(mapTokagotchiDTO),
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

  const state: CollectionModalState = error
    ? { status: 'error', error: error instanceof Error ? error.message : 'Error al cargar la coleccion' }
    : !data
      ? { status: 'loading' }
      : { status: 'ready', data }

  const activate = useCallback(async (id: string) => {
    if (!data) return

    const active = data.roster.find((t) => t.id === id) ?? null
    const nextData: CollectionModalData = {
      ...data,
      activeId: id,
      roster: active
        ? [active, ...data.roster.filter((t) => t.id !== id)]
        : data.roster,
    }

    await playerApi.setMyActiveTokagotchi(id)
    await mutate(nextData, { revalidate: false })

    await Promise.all([globalMutate('home'), globalMutate('me')])
  }, [data, globalMutate, mutate])

  const nextPage = useCallback(() => {
    if (!data?.pagination.hasNext) return
    setPage((prev) => prev + 1)
  }, [data?.pagination.hasNext])

  const prevPage = useCallback(() => {
    if (!data?.pagination.hasPrevious) return
    setPage((prev) => Math.max(0, prev - 1))
  }, [data?.pagination.hasPrevious])

  return {
    state,
    activate,
    nextPage,
    prevPage,
    reload: () => mutate(),
    isRefreshing: isValidating,
  }
}
