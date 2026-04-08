import type{ Consumible } from '../types/batalla'

export const CONSUMIBLES_TIENDA: Consumible[] = [
  {
    id: 'pocion_pequeña',
    nombre: 'Poción Pequeña',
    descripcion: '+20 HP',
    efecto: '+20 HP',
    precio: 5,
    cantidad: 0
  },
  {
    id: 'pocion_mediana',
    nombre: 'Poción Mediana',
    descripcion: '+50 HP',
    efecto: '+50 HP',
    precio: 10,
    cantidad: 0
  },
  {
    id: 'pocion_grande',
    nombre: 'Poción Grande',
    descripcion: 'HP completo',
    efecto: 'Full HP',
    precio: 15,
    cantidad: 0
  },
  {
    id: 'escudo',
    nombre: 'Escudo',
    descripcion: 'Escudo 25% HP por 2 turnos',
    efecto: 'Escudo 25% HP',
    precio: 8,
    cantidad: 0
  }
]