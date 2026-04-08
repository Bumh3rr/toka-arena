import type{ Mision } from '../types/misiones'

export const MISIONES_MOCK: Mision[] = [
  {
    id: 'mision_001',
    nombre: 'GANA UNA BATALLA PVP',
    descripcion: 'Derrota a un oponente en modo normal',
    progreso: 0,
    completada: false,
    recompensa: 10
  },
  {
    id: 'mision_002',
    nombre: 'ALIMENTA A TU TOKA',
    descripcion: 'Alimenta a tu Tokagotchi una vez',
    progreso: 0,
    completada: false,
    recompensa: 2
  },
  {
    id: 'mision_003',
    nombre: 'JUEGA CON TU TOKA',
    descripcion: 'Juega con tu Tokagotchi',
    progreso: 0,
    completada: false,
    recompensa: 3
  },
  {
    id: 'mision_004',
    nombre: 'BAÑA A TU TOKA',
    descripcion: 'Baña a tu Tokagotchi',
    progreso: 0,
    completada: false,
    recompensa: 2
  },
  {
    id: 'mision_005',
    nombre: 'COMPLETA 3 ACCIONES DE CUIDADO',
    descripcion: 'Realiza 3 acciones de cuidado en un día',
    progreso: 0,
    completada: false,
    recompensa: 4
  }
]