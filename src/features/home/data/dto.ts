import type { ActiveTokaDTO, CareDTO, EvolutionDTO, RarityDTO, StatsDTO } from "@/shared/model/dto/dto.tokagotchi";

export type CareActionDTO = "FEED" | "PLAY" | "BATHE";
export type AscendResult = "SUCCESS" | "FAIL";

export interface AscendResponseDTO {
  serverTime: string;
  result: AscendResult;
  wallet: { tf: number };
  toka: {  
    rarity: RarityDTO;
    cp: number;
    stats: StatsDTO;
    evolution: EvolutionDTO | null; // siguiente tier, o null si llegó a LEGENDARY
  };
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
