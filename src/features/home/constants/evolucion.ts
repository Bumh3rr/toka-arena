import type { Rarity } from "@/shared/types/tokagotchi";
import type { Evolution } from "@/shared/types/evolution";


export const EVOLUCION: Partial<Record<Rarity, Evolution>> = {
  COMMON: {
    nextRarity: "RARE",
    cpRequired: 100,
    costTF: 10,
    successChance: 40,
    failCooldownHours: 12,
    availableAt: null
  },
  RARE: {
    nextRarity: "EPIC",
    cpRequired: 300,
    costTF: 25,
    successChance: 30,
    failCooldownHours: 24,
    availableAt: null
  },
  EPIC: {
    nextRarity: "LEGENDARY",
    cpRequired: 600,
    costTF: 50,
    successChance: 20,
    failCooldownHours: 48,
    availableAt: null
  },
};
