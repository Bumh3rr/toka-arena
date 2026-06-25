import type { CareDTO, TokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto";

export type CareActionDTO = "FEED" | "PLAY" | "BATHE";
export type AscendResultDTO = "SUCCESS" | "FAIL";

export interface AscendResponseDTO {
  serverTime: string; // pendientes por pedirle al backend
  result: AscendResultDTO;
  tokagotchi: TokagotchiDTO;
}

export interface CareResponseDTO {
  serverTime: string; // pendientes por pedirle al backend
  missions: { claimable: number }; // pendientes por pedirle al backend
  tokagotchi: TokagotchiDTO;
  caresAvailableAt: CareDTO;
}