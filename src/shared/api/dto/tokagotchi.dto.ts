import type { AccessorySlotDTO } from "./accessory.dto";

/** Niveles de rareza posibles de un Tokagotchi, de menor a mayor. */
export type RarityDTO = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

/** Especies disponibles de Tokagotchi. */
export type SpeciesDTO = "TOFU" | "MOCHI" | "HANA";

export type NextRarityDTO = RarityDTO | "MAX";

/**
 * Datos de la próxima evolución disponible para un Tokagotchi.
 * Presente cuando aún puede subir de rareza.
 */
export interface EvolutionDTO {
  /** Rareza que alcanzará el Tokagotchi si la evolución es exitosa. */
  nextRarity: NextRarityDTO;
  /** CP mínimos requeridos para intentar la evolución. */
  cpRequired: number;
  /** Costo en TF (TokaFeed) para iniciar la evolución. */
  tfRequired: number;
  /** Probabilidad de éxito de la evolución */
  successChance: number;
  /** Horas de cooldown aplicadas si la evolución falla. */
  failCooldownHours: number;
  /** ISO 8601 con la fecha desde la que puede intentarse la evolución, o null si ya está disponible. */
  evolvedAvailableAt: string | null;
}

/** Accesorio equipado actualmente en un Tokagotchi. */
export interface EquippedAccessoryDTO {
  id: string;
  /** Ruta al manifiesto de accesorios. */
  /** /src/assets/dragonbones/accessories.manifest.json */
  /** Código interno que identifica el asset del accesorio. */
  type: string;
  /** Ranura que ocupa el accesorio. */
  slot: AccessorySlotDTO;
}

/**
 * Cooldowns de las acciones de cuidado del Tokagotchi.
 * Cada campo es un ISO 8601 que indica cuándo vuelve a estar disponible la acción,
 * o null si ya está disponible.
 */
export interface CareDTO {
  /** Próxima vez que se puede alimentar al Tokagotchi. */
  feedAvailableAt: string | null;
  /** Próxima vez que se puede jugar con el Tokagotchi. */
  playAvailableAt: string | null;
  /** Próxima vez que se puede bañar al Tokagotchi. */
  batheAvailableAt: string | null;
}

/** Estadísticas de combate base del Tokagotchi. */
export interface StatsDTO {
  /** Puntos de vida. */
  hp: number;
  /** Ataque. */
  atk: number;
  /** Defensa. */
  def: number;
}

/** Habilidad de combate que puede usar un Tokagotchi en la arena. */
export interface AbilityDTO {
  /** Identificador único de la habilidad. */
  id: number;
  /** Nombre visible de la habilidad. */
  name: string;
  /** Coste de energía para ejecutar la habilidad. */
  energyCost: number;
  /** Multiplicador de daño aplicado al ataque base. */
  multiplier: number;
  /** Descripción legible del efecto de la habilidad. */
  description: string;
  /** Indica si es la habilidad característica de la especie. */
  isSignature: boolean;
}

/**
 * Tokagotchi activo del jugador con todos sus datos de combate,
 * accesorios, estadísticas, evolución y cooldowns de cuidado.
 */
export interface TokagotchiDTO {
  id: string;
  name: string;
  species: SpeciesDTO;
  rarity: RarityDTO;
  cp: number;
  hp: number;
  atk: number;
  def: number;
  nextEvolution: EvolutionDTO;
  equipped: EquippedAccessoryDTO[] | null;
  careCooldown: CareDTO;
}