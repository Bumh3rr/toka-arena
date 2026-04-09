export type SlotAccesorio = 'cabeza' | 'cuerpo'

export interface Accesorio {
  id: string
  nombre: string
  slot: SlotAccesorio
  displayIndex: number
  desbloqueado: boolean
  imagen: string
}