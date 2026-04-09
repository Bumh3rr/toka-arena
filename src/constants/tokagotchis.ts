import type { Tokagotchi } from '../types/toka'

export const TOFU_MOCK: Tokagotchi = {
  id: 'tofu_001',
  nombre: 'Tofu',
  especie: 'tofu',
  rareza: 'Común',
  stats: {
    hp: 100,
    atk: 12,
    def: 30,
    nrg: 100
  },
  habilidades: [
    {
      id: 'mordida',
      nombre: 'Mordida',
      costoNRG: 15,
      multiplicador: 1.0,
      descripcion: 'Daño 1.0x Atk',
      esSignature: false
    },
    {
      id: 'ladrido',
      nombre: 'Ladrido',
      costoNRG: 20,
      descripcion: '+15% Ataque por 2 turnos',
      esSignature: false
    },
    {
      id: 'guardia',
      nombre: 'Guardia',
      costoNRG: 25,
      descripcion: '-30% daño recibido el próximo turno',
      esSignature: false
    },
    {
      id: 'lealtad',
      nombre: 'Lealtad',
      costoNRG: 45,
      multiplicador: 1.4,
      descripcion: 'Daño 1.4x Atk. Si HP < 30%, cura 20% del daño causado',
      esSignature: true
    }
  ],
  accesorios: {
    cabeza: null,
    cuerpo: null
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
  nombre: 'Mochi',
  especie: 'mochi',
  rareza: 'Común',
  stats: {
    hp: 90,
    atk: 16,
    def: 20,
    nrg: 100
  },
  habilidades: [
    {
      id: 'zarpazo',
      nombre: 'Zarpazo',
      costoNRG: 15,
      multiplicador: 0.9,
      descripcion: 'Daño 0.9x Atk. 20% prob. de ignorar defensa',
      esSignature: false
    },
    {
      id: 'agilidad',
      nombre: 'Agilidad',
      costoNRG: 25,
      descripcion: '25% prob. de esquivar el siguiente ataque',
      esSignature: false
    },
    {
      id: 'bufido',
      nombre: 'Bufido',
      costoNRG: 20,
      descripcion: 'Reduce Defensa del rival un 20%',
      esSignature: false
    },
    {
      id: 'frenesi',
      nombre: 'Frenesí',
      costoNRG: 45,
      multiplicador: 0.7,
      descripcion: '2 golpes de 0.7x Atk. En Legendario, 30% prob. de crítico (x1.5)',
      esSignature: true
    }
  ],
  accesorios: {
    cabeza: null,
    cuerpo: null
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
  nombre: 'Hana',
  especie: 'hana',
  rareza: 'Raro',
  stats: {
    hp: 95,
    atk: 14,
    def: 24,
    nrg: 100
  },
  habilidades: [
    {
      id: 'florazo',
      nombre: 'Florazo',
      costoNRG: 15,
      multiplicador: 1,
      descripcion: 'Daño 1.0x Atk',
      esSignature: false
    },
    {
      id: 'fotosintesis',
      nombre: 'Fotosíntesis',
      costoNRG: 20,
      descripcion: 'Recupera vitalidad y gana ritmo',
      esSignature: false
    },
    {
      id: 'espinas',
      nombre: 'Espinas',
      costoNRG: 25,
      descripcion: 'Aumenta defensa por 2 turnos',
      esSignature: false
    },
    {
      id: 'tormenta_petalos',
      nombre: 'Tormenta de Pétalos',
      costoNRG: 45,
      multiplicador: 1.35,
      descripcion: 'Daño 1.35x Atk',
      esSignature: true
    }
  ],
  accesorios: {
    cabeza: null,
    cuerpo: null
  },
  assets: {
    armatureKey: 'hana',
    texPng: '/assets/hana/hana_tex.png',
    texJson: '/assets/hana/hana_tex.json',
    skeJson: '/assets/hana/hana_ske.json'
  }
}