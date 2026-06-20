 import type { Assets } from '../../model/tokagotchi'
 import type { EquippedAccessory } from '@/shared/model/accessory'

 
 export interface TokagotchiConfig {
    width: number
    height: number
    assets: Assets
    animacionActual: string
    accessories?: EquippedAccessory[]
    reverse: boolean
  }

  export interface TokagotchiSide {
    toka: string
    animacion?: string
    bucleAnimacion?: number
    accesorioIndexCabeza?: number
    accesorioIndexCuerpo?: number
  }

  export interface BattleConfig {
    width: number
    height: number
    izquierda: TokagotchiSide
    derecha: TokagotchiSide
  }