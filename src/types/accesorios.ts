export type SlotAccesorio = 'cabeza' | 'cuerpo'
export type RarezaAccesorio = 'Común' | 'Raro' | 'Legendario'

export interface Accesorio {
  id: string
  nombre: string
  slot: SlotAccesorio
  rareza: RarezaAccesorio
  displayIndex: number
  desbloqueado: boolean
  imagen: string
}