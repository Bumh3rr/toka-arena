import type { PaginatedResponseDTO } from "./pagination.dto";

/** Ranuras de accesorio que puede ocupar un ítem equipado. */
export type AccessorySlotDTO = "HEAD" | "FACE" | "NECK" | "BACK";

export interface AccessoryDTO {
  id: string | null
  /** Ruta al manifiesto de accesorios. */
  /** /src/assets/dragonbones/accessories.manifest.json */
  /** Código interno que identifica el asset del accesorio. */
  type: string
  /** Ranura que ocupa el accesorio. */
  slot: AccessorySlotDTO
  equipped: boolean
  displayName: string
  description: string
  tokagotchiId: string | null
  price: number
}

export type AccessoryPageDTO = PaginatedResponseDTO<AccessoryDTO>