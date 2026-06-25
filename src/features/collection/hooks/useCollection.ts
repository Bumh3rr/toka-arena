import { useReducer, useCallback } from 'react'
import type { ColFilter, ColTab, AccSlotFilter } from '../types/collection.types'
import { collectionUiReducer, INITIAL_COLLECTION_UI } from './collectionUiReducer'
import { useCollectionTokas } from './useCollectionTokas'

export function useCollection() {
  const { state, activate, toggleFav, goToNextPage, goToPrevPage, reload } = useCollectionTokas()

  const [ui, dispatch] = useReducer(collectionUiReducer, INITIAL_COLLECTION_UI)

  const setTab = useCallback((tab: ColTab) => dispatch({ type: 'SET_TAB', tab }), [])
  const setFilter = useCallback((filter: ColFilter) => dispatch({ type: 'SET_FILTER', filter }), [])
  const toggleGroup = useCallback(() => dispatch({ type: 'TOGGLE_GROUP' }), [])
  const openDetail = useCallback((id: string) => dispatch({ type: 'SET_DETAIL', id }), [])
  const closeDetail = useCallback(() => dispatch({ type: 'SET_DETAIL', id: null }), [])
  const toggleAbility = useCallback((idx: number) => dispatch({ type: 'SET_EXPANDED_ABILITY', idx }), [])
  const setAccSlot = useCallback((slot: AccSlotFilter) => dispatch({ type: 'SET_ACC_SLOT', slot }), [])

  return {
    state, ui,
    setTab, setFilter, toggleGroup,
    openDetail, closeDetail,
    toggleAbility,
    setAccSlot,
    activate, toggleFav,
    goToNextPage, goToPrevPage,
    reload,
  }
}
