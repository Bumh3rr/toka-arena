import { useState, useEffect } from 'react'
import type { Tokagotchi } from '../types/toka'
import type { Accesorio } from '../types/accesorios'
import { userService } from '../services/userService'
import { mapResponseToTokagotchi } from '../services/tokagotchiService'
import { accesorioService } from '../services/accesorioService'
import { tokagotchiService } from '../services/tokagotchiService'

export type ColeccionTab = 'tokagotchi' | 'accesorios'

export function useColeccion() {
  const [tab, setTab] = useState<ColeccionTab>('tokagotchi')
  const [tokas, setTokas] = useState<Tokagotchi[]>([])
  const [tokaActivo, setTokaActivo] = useState<Tokagotchi | null>(null)
  const [accesorios, setAccesorios] = useState<Accesorio[]>([])
  const [accesorioActivoCabeza, setAccesorioActivoCabeza] = useState<Accesorio | null>(null)
  const [accesorioActivoCuerpo, setAccesorioActivoCuerpo] = useState<Accesorio | null>(null)
  const [loading, setLoading] = useState(true)


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await userService.getMe()

        // Mapear todos los tokagotchis
        const tokasMapped = me.tokagotchis.map(mapResponseToTokagotchi)
        const activoMapped = mapResponseToTokagotchi(me.tokagotchiActivo)

        setTokas(tokasMapped)
        setTokaActivo(activoMapped)

        // Mapear accesorios del usuario
        // El backend devuelve accessories con equipped pero sin type
        // Los accesorios reales con type vienen de otra fuente
        // Por ahora usamos el nombre para determinar el slot
        const accesoriosMapped: Accesorio[] = me.accessories.map((acc: any) => ({
          id: String(acc.id),
          nombre: acc.name,
          slot: getSlotByName(acc.name),
          displayIndex: getDisplayIndex(acc.name),
          desbloqueado: true,
          imagen: getImagenByName(acc.name)
        }))

        setAccesorios(accesoriosMapped)

        // Aplicar accesorios equipados del toka activo
        if (me.tokagotchiActivo.equippedHead) {
          const cabeza = accesoriosMapped.find(
            a => a.id === String(me.tokagotchiActivo.equippedHead)
          )
          if (cabeza) setAccesorioActivoCabeza(cabeza)
        }
        if (me.tokagotchiActivo.equippedBody) {
          const cuerpo = accesoriosMapped.find(
            a => a.id === String(me.tokagotchiActivo.equippedBody)
          )
          if (cuerpo) setAccesorioActivoCuerpo(cuerpo)
        }
      } catch (err) {
        console.error('Error cargando colección:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const equiparAccesorio = async (acc: Accesorio) => {
    if (!tokaActivo || !acc.desbloqueado) return

      console.log('Equipando accesorio id:', acc.id, 'en toka id:', tokaActivo.id)


    try {
      await accesorioService.equipar(tokaActivo.id, acc.id)

      if (acc.slot === 'cabeza') {
        setAccesorioActivoCabeza(prev => prev?.id === acc.id ? null : acc)
      } else {
        setAccesorioActivoCuerpo(prev => prev?.id === acc.id ? null : acc)
      }
    } catch (err) {
      console.error('Error equipando accesorio:', err)
    }
  }

        const activarToka = async (toka: Tokagotchi) => {
        try {
          await tokagotchiService.activar(toka.id)
          setTokaActivo(toka)
        } catch (err) {
          console.error('Error activando tokagotchi:', err)
        }
      }

  const tokaConAccesorios: Tokagotchi = tokaActivo
    ? {
        ...tokaActivo,
        accesorios: {
          cabeza: accesorioActivoCabeza,
          cuerpo: accesorioActivoCuerpo
        }
      }
    : { ...({} as Tokagotchi) }

    
  return {
    activarToka,
    tab, setTab,
    tokas, tokaActivo: tokaActivo ?? tokas[0],
    setTokaActivo: (t: Tokagotchi) => setTokaActivo(t),
    accesorios,
    accesorioActivoCabeza,
    accesorioActivoCuerpo,
    equiparAccesorio,
    tokaConAccesorios,
    loading
  }
}

// Helpers locales
function getSlotByName(name: string): 'cabeza' | 'cuerpo' {
  const cuerpo = ['Super Capa']
  return cuerpo.includes(name) ? 'cuerpo' : 'cabeza'
}

function getDisplayIndex(name: string): number {
  const map: Record<string, number> = {
    'Sombrero': 3, 'Corona': 2, 'Casco': 1, 'Super Capa': 1
  }
  return map[name] ?? 0
}

function getImagenByName(name: string): string {
  const map: Record<string, string> = {
    'Sombrero': '/assets/accesorios/sombrero.png',
    'Corona': '/assets/accesorios/corona.png',
    'Casco': '/assets/accesorios/casco.png',
    'Super Capa': '/assets/accesorios/capa.png'
  }
  return map[name] ?? '/assets/accesorios/sombrero.png'
}