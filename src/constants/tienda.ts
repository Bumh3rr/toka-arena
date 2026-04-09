import type { ItemTienda, PaqueteWallet } from '../types/tienda'

export const ITEMS_TIENDA_MOCK: ItemTienda[] = [
  {
    id: '1',
    nombre: 'Sombrero',
    slot: 'cabeza',
    precio: 8,
    imagen: '/assets/accesorios/uso/uso_sombrero.png',
    disponible: true
  },
  {
    id: '2',
    nombre: 'Corona',
    slot: 'cabeza',
    precio: 10,
    imagen: '/assets/accesorios/uso/uso_corona.png',
    disponible: true
  },
  {
    id: '3',
    nombre: 'Casco',
    slot: 'cabeza',
    precio: 8,
    imagen: '/assets/accesorios/uso/uso_casco.png',
    disponible: true
  },
  {
    id: '4',
    nombre: 'Super Capa',
    slot: 'cuerpo',
    precio: 10,
    imagen: '/assets/accesorios/uso/uso_capa.png',
    disponible: true
  }
]

export const PAQUETES_WALLET_MOCK: PaqueteWallet[] = [
  { id: 'paquete_1', tf: 20, precio: 19, precioPorTF: 0.95, destacado: false },
  { id: 'paquete_2', tf: 50, precio: 45, precioPorTF: 0.90, destacado: false },
  {
    id: 'paquete_3', tf: 120, precio: 99, precioPorTF: 0.825, destacado: true,
    bonus: 'Incluye un Tokagotchi Común', rarezaBonus: 'Común'
  },
  {
    id: 'paquete_4', tf: 260, precio: 199, precioPorTF: 0.765, destacado: false,
    bonus: 'Incluye un Tokagotchi Raro', rarezaBonus: 'Raro'
  }
]