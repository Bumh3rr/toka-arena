export interface PassResponseDTO {
  serverTime: string;
  season: string;
  tier: number;
  totalTiers: number;
  isPremium: boolean;
  endsAt: string | null;
}
export interface Pass {
  serverTime: number; // ms
  season: string;
  tier: number;
  totalTiers: number;
  isPremium: boolean;
  endsAt: number | null; // ms
}
