import { useState, useEffect } from 'react'
import type { Mision } from '../types/misiones'
import { userService } from '../services/userService'

function mapMision(m: any): Mision {
  return {
    id: m.id,
    nombre: m.description,
    descripcion: m.description,
    progreso: m.percentage,
    completada: m.completed,
    recompensa: m.rewardTf
  }
}

export function useMisiones() {
  const [misiones, setMisiones] = useState<Mision[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMisiones = async () => {
      try {
        const data = await userService.getMisiones()
        setMisiones(data.missions.map(mapMision))
      } catch (err) {
        console.error('Error cargando misiones:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMisiones()
  }, [])

  const completadas = misiones.filter(m => m.completada).length
  const total = misiones.length

  return { misiones, loading, completadas, total }
}