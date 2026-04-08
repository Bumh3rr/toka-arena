export interface ItemTienda {
  id: string
  nombre: string
  slot: 'cabeza' | 'cuerpo'
  rareza: 'Común' | 'Raro' | 'Legendario'
  precio: number        // en TF
  imagen: string
  disponible: boolean
}

export interface PaqueteWallet {
  id: string
  tf: number
  precio: number        // en MXN
  precioPorTF: number
  destacado: boolean
  bonus?: string        // texto extra como "Incluye un Tokagotchi Común"
  rarezaBonus?: 'Común' | 'Raro'
}