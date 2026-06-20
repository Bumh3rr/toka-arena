import type { Evolution } from "@/shared/model/evolution";
import type { Rarity, Species, Stats } from "@/shared/model/tokagotchi";

export interface PlayerProfile {
  id: number;
  username: string;
  avatar: string | null;
  tf: number;
  genesisClaimed: boolean;
  mainTokagotchi: MainTokagotchi | null;
  createdAt: number;
}

export interface MainTokagotchi {
  id: number;
  name: string;
  species: Species;
  rarity: Rarity;
  cp: number;
  stats: Stats;
  evolution: Evolution | null; 
}

export interface AuthSession {
  token: string;
  playerId: string;
  isNewPlayer: boolean;
}

export type AuthState =
  | { status: 'idle' }
  | { status: 'authenticating' }
  | { status: 'authenticated'; session: AuthSession }
  | { status: 'error'; error: string };

export interface SessionApi {
  getMe(): Promise<PlayerProfile>;
}
