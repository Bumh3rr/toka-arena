import type { ColAcc } from '../../types/collection.types'

export interface AccessoryCardViewModel {
  id: string
  name: string
  slot: ColAcc['slot']
  owned: number
  locked: boolean
  image: string | null
}

export function mapAccessoryToCardVM(accessory: ColAcc): AccessoryCardViewModel {
  return {
    id: accessory.id,
    name: accessory.name,
    slot: accessory.slot,
    owned: accessory.owned,
    locked: accessory.locked,
    image: accessory.image,
  }
}
