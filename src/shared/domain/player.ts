import type { MainTokagotchi } from "./tokagotchi";

export interface PlayerProfile {
  id: string;
  username: string;
  avatar: string | null;
  tf: number;
  genesisClaimed: boolean;
  mainTokagotchi: MainTokagotchi | null;
  createdAt: number;
}
