import type { EquippedAccessory, EquippedBySlot } from "@/shared/domain/accessory";
import { getRenderBinding } from "@/shared/render/accessoryManifest";
import type { EquippedAccessoryDTO } from "../api/dto/tokagotchi.dto";

export function mapEquipped(dtos: EquippedAccessoryDTO[]): EquippedAccessory[] {
  return dtos.flatMap((dto) => {
    const binding = getRenderBinding(dto.code);
    if (!binding) {
      console.warn(`[accessories] sin binding de render para code="${dto.code}"`);
      return [];
    }
    return [{ ...dto, displayIndex: binding.displayIndex }];
  });
}

// Normaliza la lista a map por slot para acceso O(1) al pintar
export function bySlot(list: EquippedAccessory[]): EquippedBySlot {
  return Object.fromEntries(list.map((a) => [a.slot, a])) as EquippedBySlot;
}