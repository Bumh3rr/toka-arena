import type { CollectionUi, ColTab, ColFilter, AccSlotFilter } from '../types/collection.types'

export type CollectionUiAction =
  | { type: 'SET_TAB'; tab: ColTab }
  | { type: 'SET_FILTER'; filter: ColFilter }
  | { type: 'TOGGLE_GROUP' }
  | { type: 'SET_DETAIL'; id: string | null }
  | { type: 'SET_EXPANDED_ABILITY'; idx: number | null }
  | { type: 'SET_ACC_SLOT'; slot: AccSlotFilter }

export const INITIAL_COLLECTION_UI: CollectionUi = {
  tab: 'toka',
  filter: 'all',
  group: false,
  detailId: null,
  expandedAbility: null,
  accSlot: 'todos',
}

export function collectionUiReducer(
  state: CollectionUi,
  action: CollectionUiAction,
): CollectionUi {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, tab: action.tab, detailId: null }
    case 'SET_FILTER':
      return { ...state, filter: action.filter }
    case 'TOGGLE_GROUP':
      return { ...state, group: !state.group }
    case 'SET_DETAIL':
      return { ...state, detailId: action.id, expandedAbility: null }
    case 'SET_EXPANDED_ABILITY':
      return {
        ...state,
        expandedAbility: state.expandedAbility === action.idx ? null : action.idx,
      }
    case 'SET_ACC_SLOT':
      return { ...state, accSlot: action.slot }
  }
}
