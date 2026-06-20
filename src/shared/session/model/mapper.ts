import type {
  PlayerProfileDto,
  MainTokagotchiDTO,
} from "@/shared/model/dto/dto.session";
import type { PlayerProfile, MainTokagotchi } from "./types";
import type { Evolution } from "@/shared/model/evolution";
import type { EvolutionDTO } from "@/shared/model/dto/dto.tokagotchi"; 

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