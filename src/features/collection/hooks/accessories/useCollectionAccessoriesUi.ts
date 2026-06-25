import { useState } from 'react'
import type { AccSlotFilter } from '../../types/collection.types'

export function useCollectionAccessoriesUi() {
  const [slotFilter, setSlotFilter] = useState<AccSlotFilter>('todos')

  return {
    slotFilter,
    setSlotFilter,
  }
}
