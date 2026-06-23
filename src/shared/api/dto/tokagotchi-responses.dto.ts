import type { CareDTO, EvolutionDTO, MainTokagotchiDTO, RarityDTO, StatsDTO } from "@/shared/api/dto/tokagotchi.dto";
import type { MainTokagotchi } from "@/shared/domain/tokagotchi";

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

export interface CareResponseDTO {
  serverTime: string; // pendientes por pedirle al backend
  missions: { claimable: number }; // pendientes por pedirle al backend
  tokagotchi: MainTokagotchiDTO;
  caresAvailableAt: CareDTO;
}

export interface RenameResponseDTO extends MainTokagotchi {
  any: any
}