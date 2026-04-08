export interface Mision {
  id: string
  nombre: string
  descripcion: string
  progreso: number      // 0-100
  completada: boolean
  recompensa: number    // TF
}