import type {
  HomeResponseDTO,
  CareResponseDTO,
  CareActionDTO,
  ApiError,
  ActiveTokaDTO,
  RenameResponseDTO,
} from "../home.dto";
import type { AscendResponseDTO, EvolutionDTO, AbilityDTO } from "../home.dto";
import type { Rarity, Stats, Species } from "@/shared/types/tokagotchi";
import { _mockWallet } from "@/shared/session/api/session.api";

// tablas de balance (mock):
const RARITY_MULT: Record<Rarity, number> = {
  COMMON: 1.0,
  RARE: 1.15,
  EPIC: 1.35,
  LEGENDARY: 1.55,
};
const EVO_TABLE: Record<Rarity, EvolutionDTO | null> = {
  COMMON: {
    nextRarity: "RARE",
    cpRequired: 100,
    costTF: 10,
    successChance: 40,
    failCooldownHours: 12,
    availableAt: null,
  },
  RARE: {
    nextRarity: "EPIC",
    cpRequired: 300,
    costTF: 25,
    successChance: 30,
    failCooldownHours: 24,
    availableAt: null,
  },
  EPIC: {
    nextRarity: "LEGENDARY",
    cpRequired: 600,
    costTF: 50,
    successChance: 20,
    failCooldownHours: 48,
    availableAt: null,
  },
  LEGENDARY: null,
};
const scaleStats = (s: Stats, from: Rarity, to: Rarity): Stats => {
  const r = RARITY_MULT[to] / RARITY_MULT[from];
  return {
    hp: Math.round(s.hp * r),
    atk: Math.round(s.atk * r),
    def: Math.round(s.def * r),
  };
};
export const SPECIES_ABILITIES: Record<Species, AbilityDTO[]> = {
  TOFU: [
    {
      id: 1,
      name: 'Mordida',
      energyCost: 15,
      multiplier: 1.0,
      description: 'Daño 1.0x Atk',
      isSignature: false,
    },
    {
      id: 2,
      name: 'Ladrido',
      energyCost: 20,
      multiplier: 1.15,
      description: '+15% Ataque por 2 turnos',
      isSignature: false,
    },
    {
      id: 3,
      name: 'Guardia',
      energyCost: 25,
      multiplier: 1.0,
      description: '-30% daño recibido el próximo turno',
      isSignature: false,
    },
    {
      id: 4,
      name: 'Lealtad',
      energyCost: 45,
      multiplier: 1.4,
      description: 'Daño 1.4x Atk. Si HP < 30%, cura 20% del daño causado',
      isSignature: true,
    },
  ],
  MOCHI: [
    {
      id: 623,
      name: 'Zarpazo',
      energyCost: 15,
      multiplier: 0.9,
      description: 'Daño 0.9x Atk. 20% prob. de ignorar defensa',
      isSignature: false,
    },
    {
      id: 342,
      name: 'Agilidad',
      energyCost: 25,
      multiplier: 1,
      description: '25% prob. de esquivar el siguiente ataque',
      isSignature: false,
    },
    {
      id: 4234,
      name: 'Bufido',
      energyCost: 20,
      multiplier: 1,
      description: 'Reduce Defensa del rival un 20%',
      isSignature: false,
    },
    {
      id: 123,
      name: 'Frenesí',
      energyCost: 45,
      multiplier: 0.7,
      description: '2 golpes de 0.7x Atk. En Legendario, 30% prob. de crítico (x1.5)',
      isSignature: true,
    },
  ],
  HANA: [
    {
      id: 41343,
      name: 'Florazo',
      energyCost: 15,
      multiplier: 1,
      description: 'Daño 1.0x Atk',
      isSignature: false,
    },
    {
      id: 5113,
      name: 'Fotosíntesis',
      energyCost: 20,
      multiplier: 1,
      description: 'Recupera vitalidad y gana ritmo',
      isSignature: false,
    },
    {
      id: 5234,
      name: 'Espinas',
      energyCost: 25,
      multiplier: 1,
      description: 'Aumenta defensa por 2 turnos',
      isSignature: false,
    },
    {
      id: 4534,
      name: 'Tormenta de Pétalos',
      energyCost: 45,
      multiplier: 1.35,
      description: 'Daño 1.35x Atk',
      isSignature: true,
    },
  ],
}

// Interfaz que implementan el mock y (mañana) el backend real.
export interface HomeApi {
  getHome(): Promise<HomeResponseDTO>;
  care(tokaId: number, action: CareActionDTO): Promise<CareResponseDTO>;
  rename(tokaId: number, name: string): Promise<RenameResponseDTO>;
  ascend(tokaId: number): Promise<AscendResponseDTO>;
}

// ───────────────── MOCK (reemplazar cuando haya backend) ─────────────────
const COOLDOWN_MS: Record<CareActionDTO, number> = {
  FEED: 10 * 60_000,
  PLAY: 20 * 60_000,
  BATHE: 30 * 60_000,
};
const CP_GAIN: Record<CareActionDTO, number> = { FEED: 5, PLAY: 8, BATHE: 4 };
const CARE_KEY = {
  FEED: "feedAvailableAt",
  PLAY: "playAvailableAt",
  BATHE: "batheAvailableAt",
} as const;

// Estado en memoria que SÍ muta → puedes probar el loop de cuidado de verdad
const db = {
  toka: {
    id: 1023,
    name: "Tofu_1",
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
    abilities: SPECIES_ABILITIES['TOFU'],
  } as ActiveTokaDTO,
  claimable: 1,
};

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));
const iso = (ms: number) => new Date(ms).toISOString();

export const mockHomeApi: HomeApi = {
  async getHome() {
    await delay();
    return {
      serverTime: new Date().toISOString(),
      missions: { claimable: db.claimable },
      activeToka: structuredClone(db.toka),
    };
  },
  async care(_tokaId, action) {
    await delay(400);
    const key = CARE_KEY[action];
    const until = db.toka.care[key];
    if (until && new Date(until).getTime() > Date.now()) {
      throw { error: "ON_COOLDOWN", availableAt: until } as ApiError; // simula el 409
    }
    db.toka.cp += CP_GAIN[action];
    db.toka.care[key] = iso(Date.now() + COOLDOWN_MS[action]);
    db.claimable = Math.min(3, db.claimable + 1);
    return {
      serverTime: new Date().toISOString(),
      cp: db.toka.cp,
      missions: { claimable: db.claimable },
      care: structuredClone(db.toka.care),
    };
  },
  async rename(_tokaId, name) {
    await delay(400);
    const clean = name.trim();
    if (clean.length < 2) throw { error: "INVALID_NAME" } as ApiError;
    db.toka.name = clean;
    return { id: db.toka.id, name: clean };
  },
  async ascend(_tokaId) {
    await delay(600);
    const evo = db.toka.evolution;
    console.log(_tokaId)

    // preconditions → 4xx (NO se cobra TF)
    if (!evo) throw { error: "MAX_RARITY" } as ApiError;
    if (evo.availableAt && new Date(evo.availableAt).getTime() > Date.now())
      throw { error: "ON_COOLDOWN", availableAt: evo.availableAt } as ApiError;
    if (db.toka.cp < evo.cpRequired)
      throw { error: "INSUFFICIENT_CP" } as ApiError;
    if (_mockWallet.get() < evo.costTF)
      throw { error: "INSUFFICIENT_TF" } as ApiError;

    // se cobra el intento (éxito O fallo) y se tira el dado en el "server"
    const tf = _mockWallet.debit(evo.costTF);
    const success = Math.random() * 100 < evo.successChance;

    if (success) {
      const from = db.toka.rarity;
      db.toka.rarity = evo.nextRarity;
      db.toka.stats = scaleStats(db.toka.stats, from, evo.nextRarity);
      db.toka.evolution = EVO_TABLE[evo.nextRarity]; // siguiente tier o null
      // db.toka.cp: lo dejo ACUMULATIVO (no resetea) — ver nota de diseño
    } else {
      db.toka.evolution = {
        ...evo,
        availableAt: iso(Date.now() + evo.failCooldownHours * 3_600_000),
      };
    }

    return {
      serverTime: new Date().toISOString(),
      result: success ? "SUCCESS" : "FAIL",
      wallet: { tf },
      toka: {
        rarity: db.toka.rarity,
        cp: db.toka.cp,
        stats: db.toka.stats,
        evolution: db.toka.evolution,
      },
    };
  },
};

// ════════════════════ SWAP POINT ════════════════════
export const homeApi: HomeApi = mockHomeApi;
