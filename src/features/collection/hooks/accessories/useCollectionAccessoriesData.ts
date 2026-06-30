import useSWR from 'swr'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import { collectionKeys } from '../../swr/keys'
import { playerApi } from '@/shared/player/api/player.api'
import { mapTokaDtoListToColRoster } from '../../mappers/toka/toka.dto-to-domain.mapper'

const PAGE_SIZE = 100

interface ProbadorData {
  roster: Tokagotchi[]
  activeTokaId: string
}

export function useCollectionAccessoriesData() {
  const { data, error, mutate } = useSWR<ProbadorData>(
    collectionKeys.accessories(),
    async () => {
      const [paged, profile] = await Promise.all([
        playerApi.getMyTokagotchis(0, PAGE_SIZE),
        playerApi.getMe(),
      ])
      return {
        roster: mapTokaDtoListToColRoster(paged.content),
        activeTokaId: profile.mainTokagotchi?.id ?? '',
      }
    },
  )

  return {
    roster: data?.roster ?? [],
    activeTokaId: data?.activeTokaId ?? '',
    isLoading: !data && !error,
    error,
    reload: () => mutate(),
  }
}
