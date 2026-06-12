import type { Rarity } from "../types/tokagotchi";
import type { EvolutionRule } from "../types/evolution";

export const EVOLUTION_RULES: Record<Rarity, EvolutionRule | null> = {
  COMMON:    { nextRarity: "RARE",      cpRequired: 100, costTF: 10, successChance: 40, failCooldownHours: 12 },
  RARE:      { nextRarity: "EPIC",      cpRequired: 300, costTF: 25, successChance: 30, failCooldownHours: 24 },
  EPIC:      { nextRarity: "LEGENDARY", cpRequired: 600, costTF: 50, successChance: 20, failCooldownHours: 48 },
  LEGENDARY: null,
};

export function getEvolutionRule(rarity: Rarity): EvolutionRule | null {
  return EVOLUTION_RULES[rarity];
}