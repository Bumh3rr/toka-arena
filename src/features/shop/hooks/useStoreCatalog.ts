import { useMemo } from 'react'
import useSWR from 'swr'
import { shopApi } from '../api/shop.api'
import { shopKeys } from '../swr/keys'
import { groupCatalog, type StoreGroups } from '../lib/shopCatalog'

interface UseStoreCatalogResult {
  groups: StoreGroups
  isLoading: boolean
  error: unknown
  reload: () => void
}

const EMPTY_GROUPS: StoreGroups = { accessories: [], eggs: [], specials: [] }

/** Carga el catálogo de la tienda y lo agrupa por categoría de UI. */
export function useStoreCatalog(): UseStoreCatalogResult {
  const { data, error, isLoading, mutate } = useSWR(shopKeys.catalog(), () => shopApi.getItems())

  const groups = useMemo(() => (data ? groupCatalog(data) : EMPTY_GROUPS), [data])

  return {
    groups,
    isLoading,
    error,
    reload: () => mutate(),
  }
}
