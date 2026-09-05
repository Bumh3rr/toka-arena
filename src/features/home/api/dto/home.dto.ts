import type { PlayerProfileDTO } from "@/shared/player/api/player.dto";

export interface HomeResponseDTO {
  missions: { claimable: number };
  player: PlayerProfileDTO;
}