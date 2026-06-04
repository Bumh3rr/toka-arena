import api from './api'
import type { Tokagotchi } from '../types/tokagotchi'
import type{ Accesorio } from '../types/accesorios'

// Convierte el response del backend a nuestro tipo interno
export function mapResponseToTokagotchi(data: any): Tokagotchi {
  console.log(data);
  const especie = data.species.toLowerCase() as 'tofu' | 'mochi' | 'hana'
  
  return {
    id: String(data.id),
    nombre: data.name,
    especie,
    rareza: data.rarity,
    stats: {
      hp: data.hp,
      atk: data.atk,
      def: data.def,
      nrg: 100
    },
    habilidades: data.abilities.map((ab: any) => ({
      id: String(ab.id),
      nombre: ab.name,
      costoNRG: ab.energyCost,
      multiplicador: ab.multiplier,
      descripcion: ab.description,
      esSignature: ab.signature
    })),
    accesorios: {
      cabeza: data?.equippedHead === null ? null : {
        id: data?.equippedHead ?? '',
        nombre: data?.equippedHead?.name ?? '',
        slot: 'cabeza',
        displayIndex: data?.equippedHead?.name ? getDisplayIndex(data.equippedHead.name) : 0,
        desbloqueado: true,
        imagen: ''
      },
      cuerpo: data?.equippedBody === null ? null : {
        id: data?.equippedBody ?? '',
        nombre: data?.equippedBody?.name ?? '',
        slot: 'cuerpo',
        displayIndex: data?.equippedBody?.name ? getDisplayIndex(data.equippedBody.name) : 0,
        desbloqueado: true,
        imagen: ''
      }
    },
    assets: getAssetsByEspecie(especie)
  }
}
function getDisplayIndex(name: string): number {
  const map: Record<string, number> = {
    'Sombrero': 2, 'Corona': 1, 'Casco': 0, 'Super Capa': 0
  }
  return map[name] ?? 0
}

function getAssetsByEspecie(especie: string) {
  const assets: Record<string, any> = {
    tofu: {
      armatureKey: 'tofu',
      texPng: '/assets/tofu/tofu_tex.png',
      texJson: '/assets/tofu/tofu_tex.json',
      skeJson: '/assets/tofu/tofu_ske.json'
    },
    mochi: {
      armatureKey: 'mochi',
      texPng: '/assets/mochi/mochi_tex.png',
      texJson: '/assets/mochi/mochi_tex.json',
      skeJson: '/assets/mochi/mochi_ske.json'
    },
    hana: {
      armatureKey: 'hana',
      texPng: '/assets/hana/hana_tex.png',
      texJson: '/assets/hana/hana_tex.json',
      skeJson: '/assets/hana/hana_ske.json'
    }
  }
  return assets[especie] ?? assets.tofu
}

export function mapAccesorio(acc: any): Accesorio {
  const slotMap: Record<string, 'cabeza' | 'cuerpo'> = {
    'HEAD': 'cabeza',
    'BODY': 'cuerpo'
  }

  const displayIndexMap: Record<string, number> = {
    'Sombrero': 2,
    'Corona': 1,
    'Casco': 0,
    'Super Capa': 0
  }

  const imagenMap: Record<string, string> = {
    'Sombrero': '/assets/accesorios/sombrero.png',
    'Corona': '/assets/accesorios/corona.png',
    'Casco': '/assets/accesorios/casco.png',
    'Super Capa': '/assets/accesorios/capa.png'
  }

  return {
    id: String(acc.id),
    nombre: acc.name,
    slot: slotMap[acc.type] ?? 'cabeza',
    displayIndex: displayIndexMap[acc.name] ?? 0,
    desbloqueado: acc.equipped !== undefined ? true : acc.desbloqueado ?? true,
    imagen: imagenMap[acc.name] ?? '/assets/accesorios/sombrero.png'
  }
}

export const tokagotchiService = {
  claimStarter: async (): Promise<Tokagotchi> => {
    const response = await api.post('/tokagotchi/claim-starter')
    return mapResponseToTokagotchi(response.data)
  },
  activar: async (id: string): Promise<void> => {
  await api.post(`/tokagotchi/${id}/activate`)
}
}

