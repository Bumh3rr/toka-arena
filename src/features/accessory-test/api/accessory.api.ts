import api from '@/shared/api/client'
import type { AccessoryDTO, AccessoryPageDTO } from '@/shared/api/dto/accessory.dto'

export const accessoryApi = {
  getShop: (): Promise<AccessoryDTO[]> =>
    api.get<AccessoryDTO[]>('/accessories/shop').then((r) => r.data),

  getInventory: (equipped?: boolean): Promise<AccessoryPageDTO> =>
    api
      .get<AccessoryPageDTO>('/accessories', { params: { size: 50, ...(equipped !== undefined && { equipped }) } })
      .then((r) => r.data),

  buy: (accessoryType: string): Promise<AccessoryDTO> =>
    api.post<AccessoryDTO>('/accessories/buy', { accessoryType }).then((r) => r.data),

  equip: (tokagotchiId: string, accessoryId: string): Promise<void> =>
    api.post('/accessories/equip', { tokagotchiId, accessoryId }).then(() => undefined),

  unequip: (accessoryId: string): Promise<void> =>
    api.post('/accessories/unequip', { accessoryId }).then(() => undefined),
}
