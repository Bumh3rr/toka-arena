import type { Accesorio } from '../types/accesorios'

export const ACCESORIOS_MOCK: Accesorio[] = [
  // Cabeza
  {
    id: 'sombrero',
    nombre: 'Sombrero',
    slot: 'cabeza',
    rareza: 'Común',
    displayIndex: 3,
    desbloqueado: true,
    imagen: '/assets/accesorios/sombrero.png'
  },
  {
    id: 'corona',
    nombre: 'Corona',
    slot: 'cabeza',
    rareza: 'Raro',
    displayIndex: 2,
    desbloqueado: true,
    imagen: '/assets/accesorios/corona.png'
  },
  {
    id: 'casco',
    nombre: 'Casco',
    slot: 'cabeza',
    rareza: 'Legendario',
    displayIndex: 1,
    desbloqueado: false,
    imagen: '/assets/accesorios/casco.png'
  },
  // Cuerpo
  {
    id: 'super_capa',
    nombre: 'Super Capa',
    slot: 'cuerpo',
    rareza: 'Legendario',
    displayIndex: 1,
    desbloqueado: false,
    imagen: '/assets/accesorios/capa.png'
  }
]