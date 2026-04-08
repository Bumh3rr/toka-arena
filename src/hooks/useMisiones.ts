import { useState, useEffect } from 'react'
import type { Mision } from '../types/misiones'
import { MISIONES_MOCK } from '../constants/misiones'

export function useMisiones() {
  const [misiones, setMisiones] = useState<Mision[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: reemplazar con llamada real a la API
    // const response = await api.get('/misiones/daily')
    // setMisiones(response.data)
    setTimeout(() => {
      setMisiones(MISIONES_MOCK)
      setLoading(false)
    }, 500)
  }, [])

  const completadas = misiones.filter(m => m.completada).length
  const total = misiones.length

  return { misiones, loading, completadas, total }
}