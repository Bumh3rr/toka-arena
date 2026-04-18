 export interface TokagotchiConfig {
    width: number
    height: number
    tokaActual: string
    animacionActual: string
    accesorioIndexCabeza: number
    accesorioIndexCuerpo: number
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