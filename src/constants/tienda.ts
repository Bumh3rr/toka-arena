import type { ItemTienda, PaqueteWallet } from '../types/tienda'

export const ITEMS_TIENDA_MOCK: ItemTienda[] = [
  {
    id: 'sombrero',
    nombre: 'Sombrero',
    slot: 'cabeza',
    rareza: 'Común',
    precio: 10,
    imagen: '/assets/accesorios/uso/uso_sombrero.png',
    disponible: true
  },
  {
    id: 'corona',
    nombre: 'Corona',
    slot: 'cabeza',
    rareza: 'Raro',
    precio: 25,
    imagen: '/assets/accesorios/uso/uso_corona.png',
    disponible: true
  },
  {
    id: 'casco',
    nombre: 'Casco',
    slot: 'cabeza',
    rareza: 'Legendario',
    precio: 50,
    imagen: '/assets/accesorios/uso/uso_casco.png',
    disponible: true
  },
  {
    id: 'super_capa',
    nombre: 'Super Capa',
    slot: 'cuerpo',
    rareza: 'Legendario',
    precio: 50,
    imagen: '/assets/accesorios/uso/uso_capa.png',
    disponible: true
  }
]

export const PAQUETES_WALLET_MOCK: PaqueteWallet[] = [
  {
    id: 'paquete_1',
    tf: 20,
    precio: 19,
    precioPorTF: 0.95,
    destacado: false
  },
  {
    id: 'paquete_2',
    tf: 50,
    precio: 45,
    precioPorTF: 0.90,
    destacado: false
  },
  {
    id: 'paquete_3',
    tf: 120,
    precio: 99,
    precioPorTF: 0.825,
    destacado: true,
    bonus: 'Incluye un Tokagotchi Común',
    rarezaBonus: 'Común'
  },
  {
    id: 'paquete_4',
    tf: 260,
    precio: 199,
    precioPorTF: 0.765,
    destacado: false,
    bonus: 'Incluye un Tokagotchi Raro',
    rarezaBonus: 'Raro'
  }
]