import { useState, useEffect, useCallback } from 'react'
import type { AccessoryDTO } from '@/shared/api/dto/accessory.dto'
import type { AccessorySlot } from '@/shared/domain/accessory'
import { accessoriesApi } from '../../api/accessories.api'

const PAGE_SIZE = 15

interface UseAccEquipResult {
  slotItems: AccessoryDTO[]
  loading: boolean
  loadingMore: boolean
  hasNext: boolean
  actionLoading: string | null
  loadMore: () => void
  handleEquip: (tokaId: string, accId: string) => Promise<void>
  handleUnequip: (accId: string) => Promise<void>
}

// Throws on API error — the caller handles toast and UX feedback
export function useAccEquip(slot: AccessorySlot): UseAccEquipResult {
  const [allItems, setAllItems]         = useState<AccessoryDTO[]>([])
  const [page, setPage]                 = useState(0)
  const [hasNext, setHasNext]           = useState(false)
  const [loading, setLoading]           = useState(true)
  const [loadingMore, setLoadingMore]   = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    pageNum === 0 ? setLoading(true) : setLoadingMore(true)
    try {
      const res = await accessoriesApi.getInventory({ page: pageNum, size: PAGE_SIZE })
      setAllItems(prev => append ? [...prev, ...res.content] : res.content)
      setHasNext(res.hasNext)
      setPage(pageNum)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => { fetchPage(0, false) }, [fetchPage])

  const loadMore = () => {
    if (!loadingMore && hasNext) fetchPage(page + 1, true)
  }

  const handleEquip = async (tokaId: string, accId: string): Promise<void> => {
    setActionLoading(accId)
    try {
      await accessoriesApi.equip(tokaId, accId)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnequip = async (accId: string): Promise<void> => {
    setActionLoading(accId)
    try {
      await accessoriesApi.unequip(accId)
    } finally {
      setActionLoading(null)
    }
  }

  // Only items for this slot with a valid id (shop items without id are excluded)
  const slotItems = allItems.filter(a => a.slot === slot && a.id !== null)

  return { slotItems, loading, loadingMore, hasNext, actionLoading, loadMore, handleEquip, handleUnequip }
}
