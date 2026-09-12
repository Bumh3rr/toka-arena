import api from '@/shared/api/client'
import type { BuyItemResponseDTO, ShopItemType, StoreItemDTO } from './dto/shop.dto'

/**
 * Contrato del cliente HTTP de la tienda.
 */
export interface ShopApi {
  /**
   * `GET /store/items` — catálogo completo de la tienda.
   * @param type - Filtro opcional por categoría de ítem.
   */
  getItems(type?: ShopItemType): Promise<StoreItemDTO[]>

  /**
   * `POST /store/buy` — compra un ítem. Descuenta TF del saldo del jugador.
   * @param shopItemId - ID del ítem de tienda (campo `id` del catálogo).
   * @returns El ítem comprado con `remainingTokaFeed` = saldo TF tras la compra.
   */
  buyItem(shopItemId: string): Promise<BuyItemResponseDTO>
}

const shop: ShopApi = {
  async getItems(type) {
    const { data } = await api.get<StoreItemDTO[]>('/store/items', {
      params: type ? { type } : undefined,
    })
    console.log(`Peticion GET /store/items${type ? `?type=${type}` : ''}, Respuesta:`, data)
    return data
  },

  async buyItem(shopItemId) {
    const body = { shopItemId }
    const { data } = await api.post<BuyItemResponseDTO>('/store/buy', body)
    console.log('Peticion POST /store/buy con body:', body, 'Respuesta:', data)
    return data
  },
}

export const shopApi: ShopApi = shop
