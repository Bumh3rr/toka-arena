import type { ConfigCare } from "../data/home.types"; 
import type { Rarity, Species } from "@/shared/domain/tokagotchi";
import type { Evolution } from "@/shared/domain/evolution";
import type { AbilityDTO } from "@/shared/api/dto/tokagotchi.dto";

export const CONFIG_CARE: ConfigCare[] = [
  {
    key: "feed",
    label: "Alimentar",
    cp: 5,
    cooldownSeg: 600,
    img: "/assets/ui/btn_alimentar.png",
    animation: "comer"
  },
  {
    key: "play",
    label: "Jugar",
    cp: 8,
    cooldownSeg: 1200,
    img: "/assets/ui/btn_jugar.png",
    animation: "jugar",
  },
  {
    key: "bathe",
    label: "Bañar",
    cp: 4,
    cooldownSeg: 1800,
    img: "/assets/ui/btn_ducha.png",
    animation: "bañar",
  },
];

export const EVOLUCION: Partial<Record<Rarity, Evolution>> = {
  COMMON: {
    nextRarity: "RARE",
    cpRequired: 100,
    costTF: 10,
    successChance: 40,
    failCooldownHours: 12,
    evolvedAvailableAt: null
  },
  RARE: {
    nextRarity: "EPIC",
    cpRequired: 300,
    costTF: 25,
    successChance: 30,
    failCooldownHours: 24,
    evolvedAvailableAt: null
  },
  EPIC: {
    nextRarity: "LEGENDARY",
    cpRequired: 600,
    costTF: 50,
    successChance: 20,
    failCooldownHours: 48,
    evolvedAvailableAt: null
  },
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