import type { ColAcc } from '../../types/collection.types'

const BASE_ACCESSORIES: ColAcc[] = [
  { id: 'acc_helmet', name: 'Casco', slot: 'cabeza', owned: 0, equipped: [], locked: false, code: 'HELMET', image: '/assets/accesorios/casco.png' },
  { id: 'acc_crown', name: 'Corona', slot: 'cabeza', owned: 0, equipped: [], locked: false, code: 'CROWN', image: '/assets/accesorios/corona.png' },
  { id: 'acc_hat', name: 'Sombrero', slot: 'cabeza', owned: 0, equipped: [], locked: false, code: 'HAT', image: '/assets/accesorios/sombrero.png' },
  { id: 'acc_cape', name: 'Super Capa', slot: 'cuerpo', owned: 0, equipped: [], locked: false, code: 'SUPER_CAPE', image: '/assets/accesorios/capa.png' },
  { id: 'acc_locked1', name: '???', slot: 'cara', owned: 0, equipped: [], locked: true, code: null, image: null },
  { id: 'acc_locked2', name: '???', slot: 'espalda', owned: 0, equipped: [], locked: true, code: null, image: null },
]

export function mapRosterToAccessories(roster: ColToka[], activeTokagotchi: ColToka | null): ColAcc[] {
  const accessories = structuredClone(BASE_ACCESSORIES)
  const source = activeTokagotchi && !roster.some((t) => t.id === activeTokagotchi.id)
    ? [...roster, activeTokagotchi]
    : roster

  for (const accessory of accessories) {
    if (accessory.locked) continue

    const equippedIds = source
      .filter((t) => t.equippedHead === accessory.id || t.equippedBody === accessory.id)
      .map((t) => t.id)

    accessory.equipped = equippedIds
    accessory.owned = equippedIds.length > 0 ? 1 : 0
  }

  return accessories
}
