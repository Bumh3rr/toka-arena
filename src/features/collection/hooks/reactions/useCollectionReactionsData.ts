import useSWR from 'swr'
import { collectionKeys } from '../../swr/keys'

interface ReactionsData {
  page: number
  items: Array<{ id: string; name: string }>
}

export function useCollectionReactionsData(page: number) {
  const { data, error, mutate } = useSWR<ReactionsData>(
    collectionKeys.reactions(page),
    async () => ({
      page,
      items: [],
    }),
  )

  return {
    data,
    isLoading: !data && !error,
    error,
    reload: () => mutate(),
  }
}
