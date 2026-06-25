// Categorías para los accesorios
export type AccessorySlot = "HEAD" | "FACE" | "NECK" | "BACK";

// Lo que manda el backend por cada accesorio equipado
export interface EquippedAccessory {
  code: string;
  slot: AccessorySlot;
  displayIndex: number;
}

export type EquippedBySlot = Partial<Record<AccessorySlot, EquippedAccessory>>;