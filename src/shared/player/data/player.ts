import type { Tokagotchi } from "@/shared/domain/tokagotchi";

export interface PlayerProfile {
  id: string;
  username: string;
  avatar: string | null;
  tf: number;
  genesisClaimed: boolean;
  mainTokagotchi: Tokagotchi | null;
  createdAt: number;
}
