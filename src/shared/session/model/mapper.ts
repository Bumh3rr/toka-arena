import type {
  PlayerProfileDto,
  MainTokagotchiDTO,
} from "@/shared/api/dto/session.dto";
import type { Evolution } from "@/shared/domain/evolution";
import type { EvolutionDTO } from "@/shared/api/dto/tokagotchi.dto"; 
import type { MainTokagotchi, PlayerProfile } from "@/shared/domain/player";

export const toPlayerProfile = (d: PlayerProfileDto): PlayerProfile => ({
  id: d.id,
  username: d.username,
  avatar: d.avatarUrl,
  tf: d.tokafeed,
  genesisClaimed: d.genesisClaimed,
  mainTokagotchi: d.mainTokagotchi ? toMainTokagotchi(d.mainTokagotchi) : null,
  createdAt: Date.now(),
});

export const toMainTokagotchi = (d: MainTokagotchiDTO): MainTokagotchi => ({
  id: d.id,
  name: d.name,
  species: d.species,
  rarity: d.rarity,
  cp: d.cp,
  stats: {
    hp: d.hp,
    atk: d.atk,
    def: d.def,
  },
  evolution: d.evolution ? toEvolution(d.evolution) : null,
});

export const toEvolution = (d: EvolutionDTO): Evolution => ({
  nextRarity: d.nextRarity,
  cpRequired: d.cpRequired,
  costTF: d.costTF,
  successChance: d.successChance,
  failCooldownHours: d.failCooldownHours,
  availableAt: d.availableAt ? new Date(d.availableAt).getTime() : null,
});

export const applyRename = (profile: PlayerProfile, newName: string): PlayerProfile => ({
  ...profile,
  mainTokagotchi: profile.mainTokagotchi ? { ...profile.mainTokagotchi, name: newName } : null,
});