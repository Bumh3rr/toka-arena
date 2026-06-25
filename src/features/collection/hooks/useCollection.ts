// src/features/collection/hooks/useCollection.ts
import { useReducer, useCallback } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import type { CollectionData, CollectionState, ColFilter, ColTab, AccSlotFilter } from '../types/collection.types'
import type { CollectionResponseDTO } from '../types/collection.types'
import { collectionApi } from '../api/collection.api'
import { collectionUiReducer, INITIAL_COLLECTION_UI } from './collectionUiReducer'

function mapCollection(dto: CollectionResponseDTO): CollectionData {
  return {
    serverTime: new Date(dto.serverTime).getTime(),
    activeTokaId: dto.activeTokaId,
    roster: dto.roster,
    accessories: dto.accessories,
    lockedSpecies: dto.lockedSpecies,
    speciesTotal: dto.speciesTotal,
  }
}

export function useCollection() {
  const { mutate: globalMutate } = useSWRConfig()
  const { data, error, mutate } = useSWR<CollectionData>('collection', async () => {
    const dto = await collectionApi.getCollection()
    return mapCollection(dto)
  })

  const [ui, dispatch] = useReducer(collectionUiReducer, INITIAL_COLLECTION_UI)

  const state: CollectionState = error
    ? { status: 'error', error: error instanceof Error ? error.message : 'Error al cargar' }
    : !data
      ? { status: 'loading' }
      : { status: 'ready', data }

  const setTab = useCallback((tab: ColTab) => dispatch({ type: 'SET_TAB', tab }), [])
  const setFilter = useCallback((filter: ColFilter) => dispatch({ type: 'SET_FILTER', filter }), [])
  const toggleGroup = useCallback(() => dispatch({ type: 'TOGGLE_GROUP' }), [])
  const openDetail = useCallback((id: string) => dispatch({ type: 'SET_DETAIL', id }), [])
  const closeDetail = useCallback(() => dispatch({ type: 'SET_DETAIL', id: null }), [])
  const toggleAbility = useCallback((idx: number) => dispatch({ type: 'SET_EXPANDED_ABILITY', idx }), [])
  const setAccSlot = useCallback((slot: AccSlotFilter) => dispatch({ type: 'SET_ACC_SLOT', slot }), [])

  const activate = useCallback(async (tokaId: string) => {
    await mutate(
      async (prev) => {
        await collectionApi.activate(tokaId)
        return prev ? { ...prev, activeTokaId: tokaId } : prev
      },
      {
        optimisticData: (prev) => prev ? { ...prev, activeTokaId: tokaId } : prev!,
        revalidate: false,
        rollbackOnError: true,
      },
    )
    // invalidar home para que se sincronice el toka activo
    await globalMutate('home')
  }, [mutate, globalMutate])

  const toggleFav = useCallback(async (tokaId: string, fav: boolean) => {
    await mutate(
      async (prev) => {
        await collectionApi.toggleFav(tokaId, fav)
        return prev
          ? { ...prev, roster: prev.roster.map(t => t.id === tokaId ? { ...t, fav } : t) }
          : prev
      },
      {
        optimisticData: (prev) =>
          prev
            ? { ...prev, roster: prev.roster.map(t => t.id === tokaId ? { ...t, fav } : t) }
            : prev!,
        revalidate: false,
        rollbackOnError: true,
      },
    )
  }, [mutate])

  return {
    state, ui,
    setTab, setFilter, toggleGroup,
    openDetail, closeDetail,
    toggleAbility,
    setAccSlot,
    activate, toggleFav,
    reload: () => mutate(),
  }
}
