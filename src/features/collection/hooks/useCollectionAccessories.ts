import type { CollectionData, AccSlotFilter, AccSlotKey } from '../types/collection.types'

export interface CollectionAccessoriesView {
  owned: number
  total: number
  pct: number
  visibleAccessories: CollectionData['accessories']
}

export const SLOT_CHIPS: { key: AccSlotFilter; label: string; future?: boolean }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'cabeza', label: 'Cabeza' },
  { key: 'cuerpo', label: 'Cuerpo' },
  { key: 'cara', label: 'Cara 🔒', future: true },
  { key: 'espalda', label: 'Espalda 🔒', future: true },
]

export function useCollectionAccessories(data: CollectionData, slotFilter: AccSlotFilter): CollectionAccessoriesView {
  const owned = data.accessories.filter((a) => !a.locked).length
  const total = data.accessories.length
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0

  const visibleAccessories = slotFilter === 'todos'
    ? data.accessories
    : data.accessories.filter((a) => a.slot === (slotFilter as AccSlotKey))

  return { owned, total, pct, visibleAccessories }
}