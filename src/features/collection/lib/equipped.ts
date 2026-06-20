import type { CollectionData, ColToka, AccSlotKey } from '../types/collection.types'
import type { EquippedAccessory, AccessorySlot } from '@/shared/domain/accessory'
import { getRenderBinding } from '@/shared/render/accessoryManifest'

/**
 * Vista derivada del Tokagotchi activo para el preview de la pestaña Accesorios.
 * `equipped` ya viene en el formato que consume {@link TokagotchiCanvas}.
 */
export interface ActiveTokaView {
  toka: ColToka | null
  equipped: EquippedAccessory[]
  headName: string | null
  bodyName: string | null
}

// Slot de la colección → slot de render del canvas.
const SLOT_TO_CANVAS: Partial<Record<AccSlotKey, AccessorySlot>> = {
  cabeza: 'HEAD',
  cuerpo: 'BACK',
}

const EMPTY: ActiveTokaView = { toka: null, equipped: [], headName: null, bodyName: null }

/**
 * Resuelve el Tokagotchi activo y sus accesorios equipados a partir de los ids,
 * reutilizando el manifest de render para obtener el `displayIndex`.
 */
export function getActiveTokaView(data: CollectionData): ActiveTokaView {
  const toka = data.roster.find((t) => t.id === data.activeTokaId) ?? null
  if (!toka) return EMPTY

  const findAcc = (id: string | null) =>
    id ? data.accessories.find((a) => a.id === id && !a.locked) ?? null : null

  const head = findAcc(toka.equippedHead)
  const body = findAcc(toka.equippedBody)

  const equipped: EquippedAccessory[] = []
  for (const [i, acc] of [head, body].entries()) {
    if (!acc || !acc.code) continue
    const binding = getRenderBinding(acc.code)
    const canvasSlot = SLOT_TO_CANVAS[acc.slot]
    if (!binding || !canvasSlot) continue
    equipped.push({ id: i, code: acc.code, slot: canvasSlot, displayIndex: binding.displayIndex })
  }

  return { toka, equipped, headName: head?.name ?? null, bodyName: body?.name ?? null }
}
