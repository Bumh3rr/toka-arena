export interface ItemTienda {
  id: string        // id numérico del backend como string
  nombre: string
  slot: 'cabeza' | 'cuerpo'
  precio: number
  imagen: string
  disponible: boolean
}

export interface PaqueteWallet {
  id: string
  tf: number
  precio: number
  precioPorTF: number
  destacado: boolean
  bonus?: string
  rarezaBonus?: 'Común' | 'Raro'
}