import type { ShopItemType } from '../api/dto/shop.dto'

export const shopKeys = {
  catalog: (type?: ShopItemType) => ['shop.catalog', type ?? 'all'] as const,
}

/**
 * Claves de la Wallet (compra con dinero real).
 *
 * No hay clave para el estado de un pago: el polling de `useWalletPayment` es un
 * `setInterval` dentro de un `useEffect`, no SWR, porque tiene que arrancar y
 * pararse con el paso del flujo.
 */
export const walletKeys = {
  packages: () => ['wallet.packages'] as const,
  welcomeBundle: () => ['wallet.welcomeBundle'] as const,
}
