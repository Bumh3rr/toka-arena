// Categorías para los accesorios
export type AccessorySlot = "HEAD" | "FACE" | "NECK" | "BACK";

// Lo que manda el backend por cada accesorio equipado
export interface Accessory {
  id: string | null
  /** Ruta al manifiesto de accesorios. */
  /** /src/assets/dragonbones/accessories.manifest.json */
  /** Código interno que identifica el asset del accesorio. */
  type: string
  /** Ranura que ocupa el accesorio. */
  slot: AccessorySlot
  equipped: boolean
  displayName: string
  description: string
  tokagotchiId: string | null
  price: number
  displayIndex: number;
}

/** Accesorio equipado tal como lo consume {@link TokagotchiCanvas}. */
export interface EquippedAccessory {
  id: string
  /** Código interno que identifica el asset del accesorio. */
  type: string
  /** Ranura que ocupa el accesorio. */
  slot: AccessorySlot
  /** Índice de renderizado (opcional, se asigna al mapear). */
  displayIndex?: number
}
