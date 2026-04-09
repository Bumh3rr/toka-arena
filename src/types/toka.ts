import type{ Accesorio } from "./accesorios"
// Rareza
export type Rareza = 'Común' | 'Raro' | 'Épico' | 'Legendario'

// Especie
export type Especie = 'tofu' | 'mochi' | 'hana'

// Animaciones disponibles
export type TokagotchiAnimacion =
  | 'idle'
  | 'feed'
  | 'play'
  | 'heal'
  | 'bath'
  | 'attack'
  | 'hurt'
  | 'ko'
  | 'win'
  | 'battle_idle'

// Stats base con jitter aplicado
export interface TokagotchiStats {
  hp: number
  atk: number
  def: number
  nrg: number        // siempre empieza en 100 en combate
}

// Habilidad
export interface Habilidad {
  id: string
  nombre: string
  costoNRG: number
  multiplicador?: number    // para daño
  descripcion: string
  esSignature: boolean
}

// Tokagotchi completo
export interface Tokagotchi {
  id: string
  nombre: string
  especie: Especie
  rareza: Rareza
  stats: TokagotchiStats
  habilidades: Habilidad[]
  accesorios: {
    cabeza: Accesorio | null
    cuerpo: Accesorio | null
  }
  // Assets DragonBones
  assets: {
    texPng: string
    texJson: string
    skeJson: string
    armatureKey: string
  }
}