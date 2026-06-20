import type { EquippedAccessory, AccessorySlot } from "@/shared/types/accessory";

const ALL_SLOTS: AccessorySlot[] = ["HEAD", "FACE", "NECK", "BACK"];

// armature: instancia DragonBones (window global). Ajusta los nombres de slot
// si en tu armature no se llaman igual que el slot de negocio.
export function applyAccessories(armature: any, equipped?: EquippedAccessory[]) {
  if (!armature) return
  // 1) vaciar todos los slots de accesorio (-1 = sin display)
  for (const slot of ALL_SLOTS) {
    const dbSlot = armature.armature.getSlot(slot);
    if (dbSlot) dbSlot.displayIndex = -1;
  }
  
  // Finalizar el si no hay accesorios equipados
  if (!equipped || equipped.length <= 0) return;

  // 2) pintar los equipados
  for (const acc of equipped) {
    const dbSlot = armature.armature.getSlot(acc.slot);
    if (dbSlot) dbSlot.displayIndex = acc.displayIndex;
  }
}