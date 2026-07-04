import type { AccessorySlotDTO } from '@/shared/api/dto/accessory.dto'

/** Categoría de ítem vendible en la tienda. */
export type ShopItemType = 'SKIN' | 'EGG' | 'BOOSTER' | 'EVOLUTION_SHIELD'

/** Rareza del huevo (solo para `itemType === 'EGG'`). */
export type ShopEggRarity = 'COMMON' | 'RARE' | 'EPIC'

/** Ítem del catálogo de la tienda — `GET /store/items`. */
export interface StoreItemDTO {
  id: string
  itemType: ShopItemType
  /** Tipo de accesorio para SKIN (`CROWN`, `HAT`...). `null` en NECK no disponible o no-SKIN. */
  accessoryType: string | null
  /** Rareza del huevo para EGG. `null` en otros tipos. */
  eggRarity: ShopEggRarity | null
  displayName: string
  description: string
  /** Ranura del accesorio para SKIN. `null` si no aplica (EGG/BOOSTER/SHIELD). */
  slot: AccessorySlotDTO | null
  priceInTokaFeed: number
  /** `-1` en el catálogo; saldo TF restante solo en la respuesta de compra. */
  remainingTokaFeed: number
}

/** Cuerpo de `POST /store/buy`. */
export interface BuyItemRequestDTO {
  shopItemId: string
}

/** Respuesta de `POST /store/buy` — `StoreItemDTO` con `remainingTokaFeed` actualizado. */
export type BuyItemResponseDTO = StoreItemDTO
