import type { ShopItemType } from '../api/dto/shop.dto'

export const shopKeys = {
  catalog: (type?: ShopItemType) => ['shop.catalog', type ?? 'all'] as const,
}

/**
 * Claves de la Wallet (compra con dinero real).
 *
 * `purchase` es solo para la consulta suelta del botón "Actualizar": el polling
 * en curso no pasa por SWR porque necesita arranque y parada explícitos (ver
 * `useTokaPayPurchase`).
 */
export const walletKeys = {
  packages: () => ['wallet.packages'] as const,
  welcomeBundle: () => ['wallet.welcomeBundle'] as const,
  purchase: (paymentId: string) => ['wallet.purchase', paymentId] as const,
}
