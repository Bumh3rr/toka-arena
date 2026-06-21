import type { ActiveTokaDTO, CareDTO } from "@/shared/api/dto/tokagotchi.dto";
import { SPECIES_ABILITIES } from "../constants/config";
import type { AscendResponseDTO } from "../data/dto";

export const responseHomeResponseDTO = {
  serverTime: new Date().toISOString(),
  activeToka: {
    id: 1023,
    name: "el cawn",
    species: "TOFU",
    rarity: "COMMON",
    cp: 200,
    equipped: [
      { id: 1, code: "CROWN", slot: "HEAD" },
      { id: 2, code: "SUPER_CAPE", slot: "BACK" },
    ],
    stats: { hp: 98, atk: 13, def: 31 },
    evolution: {
      nextRarity: "RARE",
      cpRequired: 100,
      costTF: 10,
      successChance: 40,
      failCooldownHours: 12,
      availableAt: null,
    },
    care: {
      feedAvailableAt: null,
      playAvailableAt: null,
      batheAvailableAt: null,
    },
    abilities: SPECIES_ABILITIES["TOFU"],
  } as ActiveTokaDTO,
  missions: {
    claimable: 1,
  },
};

export const responseCareResponseDTO = {
  serverTime: new Date().toISOString(),
  cp: 220,
  care: {
    feedAvailableAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // disponible en 1 hora (simuilado :D)
    playAvailableAt: null,
    batheAvailableAt: null,
  } as CareDTO,
  missions: {
    claimable: 1,
  },
};

export const responseRenameResponseDTO = (str: string) => {
  return str;
};

export const responseAscendResponseDTO = {
  serverTime: new Date().toISOString(),
  result: "SUCCESS",
  cp: 300,
  wallet: { tf: 32 },
  toka: {
    rarity: "RARE",
    cp: 75,
    stats: { hp: 113, atk: 15, def: 35 },
    evolution: {
      nextRarity: "EPIC",
      cpRequired: 200,
      costTF: 20,
      successChance: 30,
      failCooldownHours: 24,
      availableAt: null,
    },
  },
} as AscendResponseDTO;
