import type { AccessorySlot } from "../domain/accessory"

const ACC_DISPLAY_NAME: Record<string, string> = {
  HELMET:       'Casco',
  CROWN:        'Corona',
  HAT:          'Sombrero',
  CHEFS_HAT:    'Gorro Chef',
  MARTIAN_EARS: 'Orejas Marcianas',
  HERO_CAPE:    'Capa de Héroe',
  GLASSES:      'Gafas',
  MOUSTACHE:    'Bigote',
  PATCH:        'Parche',
}

const SLOT_LABEL: Record<AccessorySlot, string> = {
  HEAD: 'Cabeza',
  FACE: 'Cara',
  BACK: 'Espalda',
  NECK: 'Cuello',
}


export function getAccessoryDisplayName(type: string): string {
  return ACC_DISPLAY_NAME[type] ?? type
}

export function getSlotLabel(slot: AccessorySlot): string {
  return SLOT_LABEL[slot] ?? slot
}