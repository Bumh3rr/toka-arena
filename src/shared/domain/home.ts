import type { MainTokagotchi } from "./tokagotchi";

export interface HomeResponse {
  missions: { claimable: number };
  player: PlayerProfileHome;
}

export interface PlayerProfileHome {
  id: string;
  username: string;
  avatarUrl: string | null;
  tf: number;
  genesisClaimed: boolean;
  mainTokagotchi: MainTokagotchi | null;
  serverTime: number;
}