import type { Rarity,ReglaEvolucion } from '@/shared/types/tokagotchi'

export const EVOLUCION: Partial<Record<Rarity, ReglaEvolucion>> = {
  COMMON: {
    siguiente: "RARE",
    cpMeta: 100,
    costoTF: 10,
    probabilidadPct: 40,
    cooldownHoras: 12,
  },
  RARE: {
    siguiente: "EPIC",
    cpMeta: 300,
    costoTF: 25,
    probabilidadPct: 30,
    cooldownHoras: 24,
  },
  EPIC: {
    siguiente: "LEGENDARY",
    cpMeta: 600,
    costoTF: 50,
    probabilidadPct: 20,
    cooldownHoras: 48,
  },
};
