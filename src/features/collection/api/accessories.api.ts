/** 

import type { ColAcc } from '../types/collection.types'

export interface AccessoriesApi {
  getMyAccessories(): Promise<ColAcc[]>
  equip(accessoryId: string, tokaId: string): Promise<void>
  unequip(accessoryId: string, tokaId: string): Promise<void>
}

export const accessoriesApi: AccessoriesApi = {
  async getMyAccessories() {
    return []
  },
  async equip(_accessoryId, _tokaId) {
    return
  },
  async unequip(_accessoryId, _tokaId) {
    return
  },
}
*/