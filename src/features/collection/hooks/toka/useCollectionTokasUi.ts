import { useCallback, useState } from 'react'
import type { ColFilter } from '../../types/collection.types'

export function useCollectionTokasUi() {
  const [filter, setFilter] = useState<ColFilter>('all')
  const [group, setGroup] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [expandedAbility, setExpandedAbility] = useState<number | null>(null)
  const [page, setPage] = useState(0)

  const toggleGroup = useCallback(() => setGroup((prev) => !prev), [])
  const openDetail = useCallback((id: string) => setDetailId(id), [])
  const closeDetail = useCallback(() => {
    setDetailId(null)
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
    detailId,
    openDetail,
    closeDetail,
    expandedAbility,
    toggleAbility,
    page,
    setPage,
  }
}
