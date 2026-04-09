import { useState, useEffect } from 'react'
import type { Tokagotchi } from '../types/toka'
import { userService } from '../services/userService'
import { careService } from '../services/careService'
import { mapResponseToTokagotchi } from '../services/tokagotchiService'

export function useHome() {
  const [tokagotchi, setTokagotchi] = useState<Tokagotchi | null>(null)
  const [username, setUsername] = useState('')
  const [tf, setTf] = useState(0)
  const [cp, setCp] = useState(0)
  const [misiones, setMisiones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [accionando, setAccionando] = useState<'feed' | 'play' | 'bathe' | null>(null)
  const [accionExito, setAccionExito] = useState<'feed' | 'play' | 'bathe' | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [me, misionesData] = await Promise.all([
          userService.getMe(),
          userService.getMisiones()
        ])
        setUsername(me.username)
        setTf(me.tf)
        setTokagotchi(mapResponseToTokagotchi(me.tokagotchiActivo))
        setCp(me.tokagotchiActivo.cp ?? 0)
        setMisiones(misionesData.missions)
      } catch (err) {
        console.error('Error cargando home:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const ejecutarAccion = async (accion: 'feed' | 'play' | 'bathe') => {
    if (!tokagotchi || accionando) return
    setAccionando(accion)
    setErrorAccion(null)

    try {
      if (accion === 'feed') await careService.feed(tokagotchi.id)
      else if (accion === 'play') await careService.play(tokagotchi.id)
      else await careService.bathe(tokagotchi.id)

      // CP que da cada acción
      const cpGanado = accion === 'feed' ? 5 : accion === 'play' ? 8 : 4
      setCp(prev => prev + cpGanado)

      // Animación de éxito
      setAccionExito(accion)
      setTimeout(() => setAccionExito(null), 1200)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Acción en cooldown'
      setErrorAccion(msg)
      setTimeout(() => setErrorAccion(null), 2000)
    } finally {
      setAccionando(null)
    }
  }

  const renameToka = async (newName: string) => {
    if (!tokagotchi) return
    try {
      const updated = await userService.renameTokagotchi(Number(tokagotchi.id), newName)
      setTokagotchi(updated)
    } catch (err) {
      console.error('Error renombrando:', err)
    }
  }

  return {
    tokagotchi, username, tf, cp, misiones, loading,
    renameToka, ejecutarAccion, accionando, accionExito, errorAccion
  }
}