import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSWRConfig } from 'swr'
import type { AccessoryDTO } from '@/shared/api/dto/accessory.dto'
import type { AccessorySlot, EquippedAccessory } from '@/shared/domain/accessory'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import { getRenderBinding } from '@/shared/render/accessoryManifest'
import { groupByType, type AccGroup } from '../../lib/accessoryGroups'
import { accessoriesApi } from '../../api/accessories.api'

const PAGE_SIZE = 15

interface UseProbadorArgs {
  roster: Tokagotchi[]
  activeTokaId: string
  onEquipChange: () => void | Promise<void>
}

/** Convierte un ítem del inventario en el formato que consume el canvas. */
function toEquipped(dto: AccessoryDTO): EquippedAccessory {
  const renderBinding = getRenderBinding(dto.type)
  return {
    id: dto.id as string,
    type: dto.type,
    slot: dto.slot as AccessorySlot,
    displayIndex: renderBinding?.displayIndex,
    nameSlot: renderBinding?.nameSlot ?? 'unknown',
  }
}

export function useProbador({ roster, activeTokaId, onEquipChange }: UseProbadorArgs) {
  const { mutate: globalMutate } = useSWRConfig()

  const [selectedTokaId, setSelectedTokaId] = useState(activeTokaId)
  const [selectedSlot, setSelectedSlot]     = useState<AccessorySlot>('HEAD')

  // Inventario paginado y acumulado.
  const [items, setItems]               = useState<AccessoryDTO[]>([])
  const [page, setPage]                 = useState(0)
  const [hasNext, setHasNext]           = useState(false)
  const [inventoryLoading, setLoading]  = useState(true)
  const [loadingMore, setLoadingMore]   = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [inventoryError, setInventoryError] = useState(false)

  // Overrides optimistas por toka: tokaId -> equipped[] mientras la API confirma.
  const [optimistic, setOptimistic] = useState<Record<string, EquippedAccessory[]>>({})

  const fetchPage = useCallback(async (pageNum: number, append: boolean, silent = false) => {
    if (pageNum === 0 && !silent) { setLoading(true) } else if (pageNum !== 0) { setLoadingMore(true) }
    try {
      const res = await accessoriesApi.getInventory({ page: pageNum, size: PAGE_SIZE })
      setItems(prev => append ? [...prev, ...res.content] : res.content)
      setHasNext(res.hasNext)
      setPage(pageNum)
      setInventoryError(false)
    } catch {
      setInventoryError(true)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => { fetchPage(0, false) }, [fetchPage])

  // Si el active id llega tarde (SWR) y no se ha tocado nada, seguirlo.
  useEffect(() => {
    setSelectedTokaId(prev => (prev ? prev : activeTokaId))
  }, [activeTokaId])

  const loadMore = () => { if (!loadingMore && hasNext) fetchPage(page + 1, true) }

  const selectedToka = useMemo(
    () => roster.find(t => t.id === selectedTokaId) ?? null,
    [roster, selectedTokaId],
  )

  // Equipado para el canvas: override optimista o el del roster.
  const equippedForCanvas = useMemo<EquippedAccessory[]>(
    () => optimistic[selectedTokaId] ?? selectedToka?.equipped ?? [],
    [optimistic, selectedTokaId, selectedToka],
  )

  const equippedHereId = useMemo(
    () => equippedForCanvas.find(e => e.slot === selectedSlot)?.id,
    [equippedForCanvas, selectedSlot],
  )

  // Solo ítems del slot seleccionado con id válido (los de tienda no traen id).
  const slotGroups = useMemo<AccGroup[]>(() => {
    const slotItems = items.filter(a => a.slot === selectedSlot && a.id !== null)
    return groupByType(slotItems as AccessoryDTO[], equippedHereId)
  }, [items, selectedSlot, equippedHereId])

  const setOptimisticFor = (tokaId: string, next: EquippedAccessory[]) =>
    setOptimistic(prev => ({ ...prev, [tokaId]: next }))

  const clearOptimisticFor = (tokaId: string) =>
    setOptimistic(prev => { const next = { ...prev }; delete next[tokaId]; return next })

  const equip = useCallback(async (accId: string) => {
    const dto = items.find(a => a.id === accId)
    if (!dto || !selectedToka) return
    const current = optimistic[selectedTokaId] ?? selectedToka.equipped
    const next = [...current.filter(e => e.slot !== dto.slot), toEquipped(dto)]

    setActionLoading(accId)
    setOptimisticFor(selectedTokaId, next)
    try {
      await accessoriesApi.equip(selectedTokaId, accId)
      await onEquipChange()
      await globalMutate('player')
      await fetchPage(0, false, true)
      // Asume read-after-write: onEquipChange ya trajo el roster fresco antes de soltar el overlay optimista.
      clearOptimisticFor(selectedTokaId)
    } catch (err) {
      clearOptimisticFor(selectedTokaId)
      throw err
    } finally {
      setActionLoading(null)
    }
  }, [items, selectedToka, selectedTokaId, optimistic, onEquipChange, globalMutate, fetchPage])

  const unequip = useCallback(async (accId: string) => {
    if (!selectedToka) return
    const current = optimistic[selectedTokaId] ?? selectedToka.equipped
    const next = current.filter(e => e.id !== accId)

    setActionLoading(accId)
    setOptimisticFor(selectedTokaId, next)
    try {
      await accessoriesApi.unequip(accId)
      await onEquipChange()
      await globalMutate('player')
      await fetchPage(0, false, true)
      clearOptimisticFor(selectedTokaId)
    } catch (err) {
      clearOptimisticFor(selectedTokaId)
      throw err
    } finally {
      setActionLoading(null)
    }
  }, [selectedToka, selectedTokaId, optimistic, onEquipChange, globalMutate, fetchPage])

  return {
    selectedTokaId,
    selectedToka,
    selectToka: setSelectedTokaId,
    selectedSlot,
    selectSlot: setSelectedSlot,
    equippedForCanvas,
    slotGroups,
    equippedHereId,
    inventoryLoading,
    loadingMore,
    hasNext,
    loadMore,
    actionLoading,
    equip,
    unequip,
    inventoryError,
    reloadInventory: () => { void fetchPage(0, false) },
  }
}
