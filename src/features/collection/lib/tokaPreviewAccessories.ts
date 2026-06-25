import type { ColAcc, ColToka } from '../types/collection.types'
import type { EquippedAccessory, AccessorySlot } from '@/shared/domain/accessory'
import { getRenderBinding } from '@/shared/render/accessoryManifest'

const SLOT_TO_CANVAS: Record<'cabeza' | 'cuerpo', AccessorySlot> = {
  cabeza: 'HEAD',
  cuerpo: 'BACK',
}

function findAcc(accId: string | null, accessories: ColAcc[]) {
  return accId ? accessories.find((acc) => acc.id === accId && !acc.locked) ?? null : null
}

export function getTokaPreviewAccessories(toka: ColToka, accessories: ColAcc[]): EquippedAccessory[] {
  const head = findAcc(toka.equippedHead, accessories)
  const body = findAcc(toka.equippedBody, accessories)

  const equipped: EquippedAccessory[] = []
  for (const acc of [head, body]) {
    if (!acc || !acc.code) continue
    const binding = getRenderBinding(acc.code)
    if (!binding) continue

    const canvasSlot = SLOT_TO_CANVAS[acc.slot as 'cabeza' | 'cuerpo']
    if (!canvasSlot) continue

    equipped.push({
      code: acc.code,
      slot: canvasSlot,
      displayIndex: binding.displayIndex,
    })
  }

  return equipped
}