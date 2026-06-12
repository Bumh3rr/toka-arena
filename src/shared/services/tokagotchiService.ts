import api from "./api";
import type {
  Species,
  Tokagotchi,
  Assets,
  EquippedAccessory,
  Rarity,
} from "../types/tokagotchi";

import type { Evolution, EvolutionRule } from "../types/evolution";

// Convierte el response del backend a nuestro tipo interno
export function mapResponseToTokagotchi(data: any): Tokagotchi {
  console.log("Especie original del backend:");
  console.log(data);

  return {
    id: data.id,
    name: data.name,
    species: data.species,
    rarity: data.rarity,
    cp: data.cp,
    stats: {
      hp: data.hp,
      atk: data.atk,
      def: data.def,
    },
    abilities: data.abilities.map((ability: any) => ({
      id: ability.id,
      nombre: ability.name,
      energyCost: ability.energyCost,
      multiplier: ability.multiplier,
      description: ability.description,
    })),
    equippedAccessory: {
      equippedHead: mapResponseEquippedAccesory(data.equippedHead),
      equippedBody: mapResponseEquippedAccesory(data.equippedBody),
    },
    assets: getAssetsBySpecies(data.species),
    evolution: getEvolutionByRarity(data.rarity),
  };
}

function mapResponseEquippedAccesory(equipped: any): EquippedAccessory | null {
  if (equipped === null) return null;
  const data = {
    id: equipped.id,
    name: equipped.name,
    displayIndex: getDisplayIndex(equipped.name),
    typeAccessory: equipped.type,
  };
  return data as EquippedAccessory;
}

function getDisplayIndex(name: string): number {
  const map: Record<string, number> = {
    Sombrero: 2,
    Corona: 1,
    Casco: 0,
    "Super Capa": 0,
  };
  return map[name] ?? 0;
}

export function getAssetsBySpecies(especie: Species): Assets {
  const assets: Record<Species, Assets> = {
    TOFU: {
      armatureKey: "tofu",
      texPng: "/assets/tofu/tofu_tex.png",
      texJson: "/assets/tofu/tofu_tex.json",
      skeJson: "/assets/tofu/tofu_ske.json",
    },
    MOCHI: {
      armatureKey: "mochi",
      texPng: "/assets/mochi/mochi_tex.png",
      texJson: "/assets/mochi/mochi_tex.json",
      skeJson: "/assets/mochi/mochi_ske.json",
    },
    HANA: {
      armatureKey: "hana",
      texPng: "/assets/hana/hana_tex.png",
      texJson: "/assets/hana/hana_tex.json",
      skeJson: "/assets/hana/hana_ske.json",
    },
  };
  return assets[especie] ?? assets.TOFU;
}

export function getImagenSrcByEspecie(especie: Species): string {
  const map: Record<Species, string> = {
    TOFU: "/assets/tokagotchis/tofu.png",
    MOCHI: "/assets/tokagotchis/mochi.png",
    HANA: "/assets/tokagotchis/hana.png",
  };
  return map[especie] ?? map.TOFU;
}

// Simular que me lo da el backend (Se eliminará)
function getEvolutionByRarity(rareza: Rarity): Evolution | null {
  
  const reglas: Record<Rarity, EvolutionRule | null> = {
    COMMON: {
      nextRarity: "RARE",
      cpRequired: 100,
      costTF: 10,
      successChance: 40,
      failCooldownHours: 12,
    },
    RARE: {
      nextRarity: "EPIC",
      cpRequired: 300,
      costTF: 25,
      successChance: 30,
      failCooldownHours: 24,
    },
    EPIC: {
      nextRarity: "LEGENDARY",
      cpRequired: 600,
      costTF: 50,
      successChance: 20,
      failCooldownHours: 48,
    },
    LEGENDARY: null,
  };

  const response: Evolution = {
    rule: reglas[rareza],
    cooldown: null
  } as Evolution;
  
  return response;
}

export const tokagotchiService = {
  claimStarter: async (): Promise<Tokagotchi> => {
    const response = await api.post("/tokagotchi/claim-starter");
    return mapResponseToTokagotchi(response.data);
  },
  activar: async (id: number): Promise<void> => {
    await api.post(`/tokagotchi/${id}/activate`);
  },
};
