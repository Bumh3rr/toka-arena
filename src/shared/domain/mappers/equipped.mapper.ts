import type { EquippedAccessoryDTO } from "@/shared/api/dto/tokagotchi.dto";
import { getRenderBinding } from "@/shared/render/accessoryManifest";
import type { EquippedAccessory } from "../tokagotchi";

export function mapEquipped(dtos: EquippedAccessoryDTO[]): EquippedAccessory[] {
  return dtos.flatMap((dto) => {
    const binding = getRenderBinding(dto.type);
    if (!binding) {
      console.warn(`[accessories] sin binding de render para code="${dto.type}"`);
      return [];
    }
    return [{ ...dto, nameSlot: binding.nameSlot, displayIndex: binding.displayIndex }];
  });
}
