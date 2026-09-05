import type { ShopItemType } from '../api/dto/shop.dto'

export const shopKeys = {
  catalog: (type?: ShopItemType) => ['shop.catalog', type ?? 'all'] as const,
}
