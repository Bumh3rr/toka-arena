import type { PlayerProfile } from "../player/data/player";

export interface HomeResponse {
  missions: { claimable: number };
  player: PlayerProfile;
}
