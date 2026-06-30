import type { AccessoryDTO } from '@/shared/api/dto/accessory.dto'

export interface AccGroup {
  type: string
  displayName: string
  equippedHere: AccessoryDTO | null   // ítem equipado en el toka actual
  available: AccessoryDTO[]            // ítems libres de este tipo
  elsewhereCount: number              // ítems equipados en otros tokas
}

/** Agrupa ítems del inventario por `type`, marcando el equipado en el toka actual. */
export function groupByType(items: AccessoryDTO[], equippedAccId: string | undefined): AccGroup[] {
  const map = new Map<string, AccGroup>()

  for (const item of items) {
    if (!map.has(item.type)) {
      map.set(item.type, {
        type: item.type,
        displayName: item.displayName,
        equippedHere: null,
        available: [],
        elsewhereCount: 0,
      })
    }
    const g = map.get(item.type)!

    if (item.id === equippedAccId) {
      g.equippedHere = item
    } else if (item.equipped) {
      g.elsewhereCount++
    } else {
      g.available.push(item)
    }
  }

  // Orden: equipado aquí primero, luego con disponibles, luego el resto.
  return Array.from(map.values()).sort((a, b) => {
    if (a.equippedHere && !b.equippedHere) return -1
    if (!a.equippedHere && b.equippedHere) return 1
    if (a.available.length > 0 && b.available.length === 0) return -1
    if (a.available.length === 0 && b.available.length > 0) return 1
    return 0
  })
}

/** Resumen textual de un grupo: "Equipado aquí · 2 disponibles · 1 en otro Toka". */
export function buildMeta(g: AccGroup): string {
  const parts: string[] = []
  if (g.equippedHere)     parts.push('Equipado aquí')
  if (g.available.length) parts.push(`${g.available.length} disponible${g.available.length > 1 ? 's' : ''}`)
  if (g.elsewhereCount)   parts.push(`${g.elsewhereCount} en otro${g.elsewhereCount > 1 ? 's Tokas' : ' Toka'}`)
  return parts.join(' · ')
}
