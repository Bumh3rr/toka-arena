
export type RarityDTO = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type SpeciesDTO = "TOFU" | "MOCHI" | "HANA";
export type AccessorySlotDTO = "HEAD" | "FACE" | "NECK" | "BACK";

export interface EvolutionDTO {
  nextRarity: RarityDTO;
  cpRequired: number;
  costTF: number;
  successChance: number;
  failCooldownHours: number;
  availableAt: string | null;
}

export interface EquippedAccessoryDTO {
  id: number;
  code: string;
  slot: AccessorySlotDTO;
}
export interface CareDTO {
  feedAvailableAt: string | null;
  playAvailableAt: string | null;
  batheAvailableAt: string | null;
}
export interface StatsDTO {
  hp: number;
  atk: number;
  def: number;
}
export interface AbilityDTO {
  id: number;
  name: string;
  energyCost: number;
  multiplier: number;
  description: string;
  isSignature: boolean;
}
export interface ActiveTokaDTO {
  id: number;
  name: string;
  species: SpeciesDTO;
  rarity: RarityDTO;
  cp: number;
  abilities: AbilityDTO[];
  equipped: EquippedAccessoryDTO[];
  stats: StatsDTO;
  evolution: EvolutionDTO | null; // null = rareza máxima
  care: CareDTO;
}