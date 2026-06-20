export type RarezaBonus = "Común" | "Raro"; // Tipo de rareza para el bonus de los paquetes de wallet
export type SlotAccesorio = "cabeza" | "cuerpo"; // Tipo de slot para los accesorios

export interface ItemTienda {
  id: string        // id numérico del backend como string
  nombre: string
  slot: SlotAccesorio
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
  rarezaBonus?: RarezaBonus
}