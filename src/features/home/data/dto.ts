import type { AccessorySlot } from "@/shared/types/accessory";
import type { Rarity, Species } from "@/shared/types/tokagotchi";

export type CareActionDTO = "FEED" | "PLAY" | "BATHE";
export type AscendResult = "SUCCESS" | "FAIL";

export interface AscendResponseDTO {
  serverTime: string;
  result: AscendResult;
  wallet: { tf: number };
  toka: {  
    rarity: Rarity;
    cp: number;
    stats: StatsDTO;
    evolution: EvolutionDTO | null; // siguiente tier, o null si llegó a LEGENDARY
  };
}
export interface EquippedAccessoryDTO {
  id: number;
  code: string;
  slot: AccessorySlot;
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
export interface EvolutionDTO {
  nextRarity: Rarity;
  cpRequired: number;
  costTF: number;
  successChance: number;
  failCooldownHours: number;
  availableAt: string | null;
}
export interface ActiveTokaDTO {
  id: number;
  name: string;
  species: Species;
  rarity: Rarity;
  cp: number;
  abilities: AbilityDTO[];
  equipped: EquippedAccessoryDTO[];
  stats: StatsDTO;
  evolution: EvolutionDTO | null; // null = rareza máxima
  care: CareDTO;
}
export interface HomeResponseDTO {
  serverTime: string;
  missions: { claimable: number };
  activeToka: ActiveTokaDTO | null;
}
export interface CareResponseDTO {
  serverTime: string;
  cp: number;
  missions: { claimable: number };
  care: CareDTO;
}
export interface ApiError {
  error: string;
  availableAt?: string;
}
export interface RenameResponseDTO {
  id: number;
  name: string;
}
