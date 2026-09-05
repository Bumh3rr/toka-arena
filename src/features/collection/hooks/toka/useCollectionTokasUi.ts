import { useCallback, useState } from 'react'
import type { ColFilter } from '../../types/collection.types'

export function useCollectionTokasUi() {
  const [filter, setFilterState] = useState<ColFilter>('all')
  const [group, setGroup] = useState(false)
  const [detailGroupIds, setDetailGroupIds] = useState<string[] | null>(null)
  const [expandedAbility, setExpandedAbility] = useState<number | null>(null)
  const [page, setPage] = useState(0)

  const setFilter = useCallback((f: ColFilter) => {
    setFilterState(f)
    setPage(0)
  }, [])

  const toggleGroup = useCallback(() => setGroup((prev) => !prev), [])

  const openDetail = useCallback((ids: string[]) => setDetailGroupIds(ids), [])

  const closeDetail = useCallback(() => {
    setDetailGroupIds(null)
    setExpandedAbility(null)
  }, [])

  const toggleAbility = useCallback((idx: number) => {
    setExpandedAbility((prev) => (prev === idx ? null : idx))
  }, [])

  return {
    filter,
    setFilter,
    group,
    toggleGroup,
    detailGroupIds,
    openDetail,
    closeDetail,
    expandedAbility,
    toggleAbility,
    page,
    setPage,
  }
}
