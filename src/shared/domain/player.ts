import type { Evolution } from "./evolution";
import type { Rarity, Species, Stats } from "./tokagotchi";

export interface PlayerProfile {
  id: string;
  username: string;
  avatar: string | null;
  tf: number;
  genesisClaimed: boolean;
  mainTokagotchi: MainTokagotchi | null;
  createdAt: number;
}

export interface MainTokagotchi {
  id: string;
  name: string;
  species: Species;
  rarity: Rarity;
  cp: number;
  stats: Stats;
  evolution: Evolution | null; 
}