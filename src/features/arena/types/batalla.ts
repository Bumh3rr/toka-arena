export type ModoBatalla = 'normal' | 'apuesta'
export type FaseBatalla = 'lobby' | 'preparacion' | 'espera' | 'batalla' | 'victoria' | 'derrota'

export interface Consumible {
  id: string
  nombre: string
  descripcion: string
  efecto: string
  precio: number
  cantidad: number
}

export interface HabilidadBatalla {
  id: string
  nombre: string
  costoNRG: number
  multiplicador?: number
  descripcion: string
  esSignature: boolean
}

export interface EstadoBatalla {
  turno: number
  esMiTurno: boolean
  hpJugador: number
  hpMaxJugador: number
  hpRival: number
  hpMaxRival: number
  nrgJugador: number
  escudoActivo: boolean
  log: string[]
  ganador: 'jugador' | 'rival' | null
}

export interface ResultadoBatalla {
  ganador: 'jugador' | 'rival'
  turnos: number
  danoTotal: number
  hpRestante: number
  recompensaTF: number
  modo: ModoBatalla
}