    import { useState, useEffect } from 'react'
import type { Tokagotchi } from '../types/toka'
import { userService } from '../services/userService'
import { mapResponseToTokagotchi } from '../services/tokagotchiService'

export function useHome() {
  const [tokagotchi, setTokagotchi] = useState<Tokagotchi | null>(null)
  const [username, setUsername] = useState('')
  const [tf, setTf] = useState(0)
  const [cp, setCp] = useState(0)
  const [misiones, setMisiones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const renameToka = async (newName: string) => {
    if (!tokagotchi) return
    try {
      const updated = await userService.renameTokagotchi(Number(tokagotchi.id), newName)
      setTokagotchi(updated)
    } catch (err) {
      console.error('Error renombrando:', err)
    }
  }

  return { tokagotchi, username, tf, cp, misiones, loading, renameToka }
}