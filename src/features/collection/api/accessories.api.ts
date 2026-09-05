import api from '@/shared/api/client'
import type { AccessoryPageDTO } from '@/shared/api/dto/accessory.dto'

export interface InventoryParams {
  page?: number
  size?: number
  equipped?: boolean
}

export const accessoriesApi = {
  getInventory: (params: InventoryParams = {}): Promise<AccessoryPageDTO> =>
    api
      .get<AccessoryPageDTO>('/accessories', {
        params: { size: 15, page: 0, ...params },
      })
      .then((r) => r.data),

  equip: (tokagotchiId: string, accessoryId: string): Promise<void> =>
    api.post('/accessories/equip', { tokagotchiId, accessoryId }).then(() => undefined),

  unequip: (accessoryId: string): Promise<void> =>
    api.post('/accessories/unequip', { accessoryId }).then(() => undefined),
}
