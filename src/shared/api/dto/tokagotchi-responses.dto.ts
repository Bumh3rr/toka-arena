import type { CareDTO, MainTokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto";

export type CareActionDTO = "FEED" | "PLAY" | "BATHE";
export type AscendResultDTO = "SUCCESS" | "FAIL";

export interface AscendResponseDTO {
  result: AscendResultDTO;
  tokagotchi: MainTokagotchiDTO;
}

export interface CareResponseDTO {
  serverTime: string; // pendientes por pedirle al backend
  missions: { claimable: number }; // pendientes por pedirle al backend
  tokagotchi: MainTokagotchiDTO;
  caresAvailableAt: CareDTO;
}