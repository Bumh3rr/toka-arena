import type { EvolutionDTO, RarityDTO, SpeciesDTO } from "./dto.tokagotchi";

export interface PlayerProfileDto {
  id: number;
  username: string;
  avatarUrl: string | null;
  tokafeed: number;
  genesisClaimed: boolean;
  mainTokagotchi: MainTokagotchiDTO | null;
}

export interface MainTokagotchiDTO {
  id: number;
  name: string;
  species: SpeciesDTO;
  rarity: RarityDTO;
  cp: number;
  hp: number;
  atk: number;
  def: number;
  evolution: EvolutionDTO | null; 
}

/** 
export interface MeResponseDTO {
  id: number;
  username: string;
  avatar: string | null;
  wallet: { tf: number };
  activeTokaId: number | null; // null = sin toka → /unboxing
  createdAt: string;
}
*/