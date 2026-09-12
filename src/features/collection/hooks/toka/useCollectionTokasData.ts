import { useCallback } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import type { ColFilter, CollectionTokagotchiData, CollectionTokasState } from '../../types/collection.types'
import { collectionKeys } from '../../swr/keys'
import { playerApi } from '@/shared/player/api/player.api'
import { tokagotchiApi } from '@/shared/api/tokagotchi.api'
import { mapTokaDtoListToColRoster } from '../../mappers/toka.mapper'
import { mapTokagotchiDTO } from '@/shared/domain/mappers/tokagotchi.mapper'
import { RARITY_META } from '@/shared/constants/rarity'
import { getApiErrorMessage } from '@/shared/api/client'
import { useToast } from '@/shared/hooks/useToast'
import type { PlayerProfile } from '@/shared/player/data/player'

const PAGE_SIZE = 10

export function useCollectionTokasData(page: number, filter: ColFilter) {
  const { mutate: globalMutate } = useSWRConfig()
  const { show, toast } = useToast()
  const { data: playerProfile } = useSWR<PlayerProfile>('player', () => playerApi.getMe())

  const apiFilters = filter !== 'all' && filter !== 'fav' ? { rarity: filter } : undefined

  const { data, error, mutate } = useSWR<CollectionTokagotchiData, Error>(
    playerProfile ? collectionKeys.tokas(page, PAGE_SIZE, filter) : null,
    async (): Promise<CollectionTokagotchiData> => {
      const paged = await playerApi.getMyTokagotchis(page, PAGE_SIZE, apiFilters)
      const roster = mapTokaDtoListToColRoster(paged.content)

      return {
        serverTime: playerProfile!.serverTime,
        tf: playerProfile!.tf,
        activeTokaId: playerProfile!.mainTokagotchi?.id ?? null,
        activeTokagotchi: playerProfile!.mainTokagotchi ?? null,
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
    try {
      await mutate(async (prev) => {
        const activeTokagotchi = await playerApi.setMyActiveTokagotchi(tokaId)
        if (!prev) return prev
        await globalMutate('player', (p: PlayerProfile | undefined) =>
          p ? { ...p, mainTokagotchi: activeTokagotchi } : p, { revalidate: false }
        )
        return { ...prev, activeTokaId: tokaId, activeTokagotchi }
      }, { revalidate: false })
    } catch (err) {
      const msg = getApiErrorMessage(err, 'No se pudo activar')
      show(msg, { variant: 'danger' })
    }
  }, [mutate, globalMutate, show])

  const setFavorite = useCallback(async (tokaId: string, fav: boolean) => {
    try {
    await mutate(async (prev) => {
      // await favoritesApi.setFavorite(tokaId, fav)
      return prev ? { ...prev, roster: prev.roster.map((t) => (t.id === tokaId ? { ...t, fav } : t)) } : prev
    })
    } catch (err) {
      const msg = getApiErrorMessage(err, 'No se pudo actualizar favorito')
      show(msg, { variant: 'danger' })
    }
  }, [mutate, show])

  const ascend = useCallback(async (tokaId: string): Promise<'SUCCESS' | 'FAIL' | null> => {
    try {
      const res = await tokagotchiApi.ascend(tokaId)

      const update = mapTokagotchiDTO(res.tokagotchi)
      await mutate((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          roster: prev.roster.map((t) => (t.id === tokaId ? { ...t, ...update } : t)),
          activeTokagotchi: prev.activeTokagotchi?.id === tokaId ? { ...prev.activeTokagotchi, ...update } : prev.activeTokagotchi,
        }
      }, { revalidate: false })

      // Refresca TF del servidor y actualiza ambos cachés
      const resMe = await playerApi.getMe()
      await mutate((prev) => (prev ? { ...prev, tf: resMe.tf } : prev), { revalidate: false })
      await globalMutate('player', resMe, { revalidate: false })

      const rarityLabel = RARITY_META[res.tokagotchi.rarity].label
      show(
        res.result === 'SUCCESS' ? `¡Ascendió a ${rarityLabel}!` : 'La ascensión falló. Toca esperar :(',
        { variant: res.result === 'SUCCESS' ? 'celebrity' : 'danger' },
      )

      return res.result
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Ocurrió un error al ascender')
      show(msg, { variant: 'danger' })
      return null
    }
  }, [mutate, globalMutate, show])

  const rename = useCallback(async (tokaId: string, newName: string) => {
    try {
      await tokagotchiApi.rename(tokaId, newName)
      await mutate((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          roster: prev.roster.map((t) => t.id === tokaId ? { ...t, name: newName } : t),
          activeTokagotchi: prev.activeTokagotchi?.id === tokaId
            ? { ...prev.activeTokagotchi, name: newName }
            : prev.activeTokagotchi,
        }
      }, { revalidate: false })
    } catch (err) {
      show(getApiErrorMessage(err, 'No se pudo renombrar'), { variant: 'danger' })
    }
  }, [mutate, show])

  return {
    isLoading: !data && !error,
    error: state.status === 'error' ? state.error : null,
    data: state.status === 'ready' ? state.data : null,
    activate,
    setFavorite,
    ascend,
    rename,
    reload: () => mutate(),
    toast,
  }
}
