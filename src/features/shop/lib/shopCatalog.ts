import type { StoreItemDTO } from '../api/dto/shop.dto'
import type { ItemAvailability, StoreFilter } from '../types/shop.types'

/**
 * Determina si un ítem del catálogo se puede comprar.
 *
 * Único caso `'soon'`: accesorios NECK, que existen en el catálogo pero aún no
 * tienen `accessoryType` asignado en el backend (`SKIN` con `accessoryType === null`).
 * Todo lo demás (SKIN con tipo, EGG, BOOSTER, EVOLUTION_SHIELD) es comprable.
 */
export function getItemAvailability(item: StoreItemDTO): ItemAvailability {
  if (item.itemType === 'SKIN' && item.accessoryType === null) return 'soon'
  return 'buyable'
}

export interface StoreGroups {
  accessories: StoreItemDTO[]
  eggs: StoreItemDTO[]
  specials: StoreItemDTO[]
}

/**
 * Agrupa el catálogo por categoría de UI.
 * - Accesorios: comprables primero, luego "próximamente" (NECK); por precio dentro de cada bloque.
 * - Huevos y especiales: por precio ascendente.
 */
export function groupCatalog(items: StoreItemDTO[]): StoreGroups {
  const accessories: StoreItemDTO[] = []
  const eggs: StoreItemDTO[] = []
  const specials: StoreItemDTO[] = []

  for (const item of items) {
    switch (item.itemType) {
      case 'SKIN':
        accessories.push(item)
        break
      case 'EGG':
        eggs.push(item)
        break
      case 'BOOSTER':
      case 'EVOLUTION_SHIELD':
        specials.push(item)
        break
    }
  }

  accessories.sort((a, b) => {
    const aSoon = getItemAvailability(a) === 'soon' ? 1 : 0
    const bSoon = getItemAvailability(b) === 'soon' ? 1 : 0
    if (aSoon !== bSoon) return aSoon - bSoon
    return a.priceInTokaFeed - b.priceInTokaFeed
  })
  eggs.sort((a, b) => a.priceInTokaFeed - b.priceInTokaFeed)
  specials.sort((a, b) => a.priceInTokaFeed - b.priceInTokaFeed)

  return { accessories, eggs, specials }
}

/** Indica si un grupo debe mostrarse según el filtro de categoría activo. */
export function isGroupVisible(filter: StoreFilter, group: keyof StoreGroups): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'acc':
      return group === 'accessories'
    case 'eggs':
      return group === 'eggs'
    case 'specials':
      return group === 'specials'
  }
}
