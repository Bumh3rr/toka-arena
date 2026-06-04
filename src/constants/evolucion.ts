import type { Rareza } from '../types/tokagotchi'

export interface ReglaEvolucion {
  siguiente: string
  cpMeta: number
  costoTF: number
  probabilidadPct: number
  cooldownHoras: number
}

export const EVOLUCION: Partial<Record<Rareza, ReglaEvolucion>> = {
  COMMON: {
    siguiente: "Raro",
    cpMeta: 100,
    costoTF: 10,
    probabilidadPct: 40,
    cooldownHoras: 12,
  },
  RARE: {
    siguiente: "Épico",
    cpMeta: 300,
    costoTF: 25,
    probabilidadPct: 30,
    cooldownHoras: 24,
  },
  EPIC: {
    siguiente: "Legendario",
    cpMeta: 600,
    costoTF: 50,
    probabilidadPct: 20,
    cooldownHoras: 48,
  },
};
