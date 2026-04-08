import { useState } from 'react'
import type{ Tokagotchi } from '../types/toka'
import type { Accesorio } from '../types/accesorios'
import { TOFU_MOCK, MOCHI_MOCK } from '../constants/tokagotchis'
import { ACCESORIOS_MOCK } from '../constants/accesorios'

export type ColeccionTab = 'tokagotchi' | 'accesorios'

export function useColeccion() {
  const [tab, setTab] = useState<ColeccionTab>('tokagotchi')
  const [tokas] = useState<Tokagotchi[]>([MOCHI_MOCK,TOFU_MOCK])
  const [tokaActivo, setTokaActivo] = useState<Tokagotchi>(MOCHI_MOCK)
  const [accesorios] = useState<Accesorio[]>(ACCESORIOS_MOCK)
  const [accesorioActivoCabeza, setAccesorioActivoCabeza] = useState<Accesorio | null>(null)
  const [accesorioActivoCuerpo, setAccesorioActivoCuerpo] = useState<Accesorio | null>(null)

  const equiparAccesorio = (acc: Accesorio) => {
    if (!acc.desbloqueado) return
    if (acc.slot === 'cabeza') {
      setAccesorioActivoCabeza(prev => prev?.id === acc.id ? null : acc)
    } else {
      setAccesorioActivoCuerpo(prev => prev?.id === acc.id ? null : acc)
    }
    // TODO: llamar API para guardar accesorio
  }

  const tokaConAccesorios: Tokagotchi = {
    ...tokaActivo,
    accesorios: {
      cabeza: accesorioActivoCabeza,
      cuerpo: accesorioActivoCuerpo
    }
  }

  return {
    tab, setTab,
    tokas, tokaActivo, setTokaActivo,
    accesorios,
    accesorioActivoCabeza,
    accesorioActivoCuerpo,
    equiparAccesorio,
    tokaConAccesorios
  }
}