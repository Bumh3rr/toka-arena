import type { MainTokagotchiDTO } from "./tokagotchi.dto";

export interface HomeResponseDTO {
  missions: { claimable: number };
  player: PlayerProfileHomeDTO;
}

export interface PlayerProfileHomeDTO {
  serverTime: string;
  id: string;
  username: string;
  avatarUrl: string | null;
  tokafeed: number;
  genesisClaimed: boolean;
  mainTokagotchi: MainTokagotchiDTO | null;
}
