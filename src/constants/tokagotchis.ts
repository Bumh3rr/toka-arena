import type { Tokagotchi } from '../types/tokagotchi'

export const TOFU_MOCK: Tokagotchi = {
  id: 'tofu_001',
  name: 'Tofu',
  species: 'TOFU',
  rarity: 'COMMON',
  stats: {
    hp: 100,
    atk: 12,
    def: 30,
    nrg: 100
  },
  abilities: [
    {
      id: 'mordida',
      name: 'Mordida',
      energyCost: 15,
      multiplier: 1.0,
      description: 'Daño 1.0x Atk',
      isSignature: false
    },
    {
      id: 'ladrido',
      name: 'Ladrido',
      energyCost: 20,
      description: '+15% Ataque por 2 turnos',
      isSignature: false
    },
    {
      id: 'guardia',
      name: 'Guardia',
      energyCost: 25,
      description: '-30% daño recibido el próximo turno',
      isSignature: false
    },
    {
      id: 'lealtad',
      name: 'Lealtad',
      energyCost: 45,
      multiplier: 1.4,
      description: 'Daño 1.4x Atk. Si HP < 30%, cura 20% del daño causado',
      isSignature: true
    }
  ],
  equippedAccessory: {
    equippedHead: null,
    equippedBody: null
  },
  assets: {
    armatureKey: 'tofu',
    texPng: '/assets/tofu/tofu_tex.png',
    texJson: '/assets/tofu/tofu_tex.json',
    skeJson: '/assets/tofu/tofu_ske.json'
  }
}

export const MOCHI_MOCK: Tokagotchi = {
  id: 'mochi_001',
  name: 'Mochi',
  species: 'MOCHI',
  rarity: 'COMMON',
  stats: {
    hp: 90,
    atk: 16,
    def: 20,
    nrg: 100
  },
  abilities: [
    {
      id: 'zarpazo',
      name: 'Zarpazo',
      energyCost: 15,
      multiplier: 0.9,
      description: 'Daño 0.9x Atk. 20% prob. de ignorar defensa',
      isSignature: false
    },
    {
      id: 'agilidad',
      name: 'Agilidad',
      energyCost: 25,
      description: '25% prob. de esquivar el siguiente ataque',
      isSignature: false
    },
    {
      id: 'bufido',
      name: 'Bufido',
      energyCost: 20,
      description: 'Reduce Defensa del rival un 20%',
      isSignature: false
    },
    {
      id: 'frenesi',
      name: 'Frenesí',
      energyCost: 45,
      multiplier: 0.7,
      description: '2 golpes de 0.7x Atk. En Legendario, 30% prob. de crítico (x1.5)',
      isSignature: true
    }
  ],
  equippedAccessory: {
    equippedHead: null,
    equippedBody: null
  },
  assets: {
    armatureKey: 'mochi',
    texPng: '/assets/mochi/mochi_tex.png',
    texJson: '/assets/mochi/mochi_tex.json',
    skeJson: '/assets/mochi/mochi_ske.json'
  }
}

export const HANA_MOCK: Tokagotchi = {
  id: 'hana_001',
  name: 'Hana',
  species: 'HANA',
  rarity: 'RARE',
  stats: {
    hp: 95,
    atk: 14,
    def: 24,
    nrg: 100
  },
  abilities: [
    {
      id: 'florazo',
      name: 'Florazo',
      energyCost: 15,
      multiplier: 1,
      description: 'Daño 1.0x Atk',
      isSignature: false
    },
    {
      id: 'fotosintesis',
      name: 'Fotosíntesis',
      energyCost: 20,
      description: 'Recupera vitalidad y gana ritmo',
      isSignature: false
    },
    {
      id: 'espinas',
      name: 'Espinas',
      energyCost: 25,
      description: 'Aumenta defensa por 2 turnos',
      isSignature: false
    },
    {
      id: 'tormenta_petalos',
      name: 'Tormenta de Pétalos',
      energyCost: 45,
      multiplier: 1.35,
      description: 'Daño 1.35x Atk',
      isSignature: true
    }
  ],
  equippedAccessory: {
    equippedHead: null,
    equippedBody: null
  },
  assets: {
    armatureKey: 'hana',
    texPng: '/assets/hana/hana_tex.png',
    texJson: '/assets/hana/hana_tex.json',
    skeJson: '/assets/hana/hana_ske.json'
  }
}