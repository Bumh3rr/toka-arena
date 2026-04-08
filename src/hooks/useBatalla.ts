import { useState } from 'react'
import type{
  ModoBatalla,
  FaseBatalla,
  Consumible,
  EstadoBatalla,
  ResultadoBatalla
} from '../types/batalla'
import { CONSUMIBLES_TIENDA } from '../constants/consumibles'
import type{ Tokagotchi } from '../types/toka'
import { TOFU_MOCK, MOCHI_MOCK } from '../constants/tokagotchis'

export function useBatalla() {
  const [fase, setFase] = useState<FaseBatalla>('lobby')
  const [modo, setModo] = useState<ModoBatalla>('normal')
  const [tfDisponible] = useState(10)
  const [consumibles, setConsumibles] = useState<Consumible[]>(CONSUMIBLES_TIENDA)
  const [rival, setRival] = useState<Tokagotchi | null>(null)
  const [resultado, setResultado] = useState<ResultadoBatalla | null>(null)

  const [estadoBatalla, setEstadoBatalla] = useState<EstadoBatalla>({
    turno: 1,
    esMiTurno: true,
    hpJugador: TOFU_MOCK.stats.hp,
    hpMaxJugador: TOFU_MOCK.stats.hp,
    hpRival: MOCHI_MOCK.stats.hp,
    hpMaxRival: MOCHI_MOCK.stats.hp,
    nrgJugador: 100,
    escudoActivo: false,
    log: ['¡La batalla comienza!'],
    ganador: null
  })

  const comprarConsumible = (id: string) => {
    const item = consumibles.find(c => c.id === id)
    if (!item) return
    // TODO: verificar TF disponible y llamar API
    setConsumibles(prev =>
      prev.map(c => c.id === id ? { ...c, cantidad: c.cantidad + 1 } : c)
    )
  }

  const devolverConsumible = (id: string) => {
    setConsumibles(prev =>
      prev.map(c => c.id === id && c.cantidad > 0
        ? { ...c, cantidad: c.cantidad - 1 }
        : c
      )
    )
  }

  const buscarRival = () => {
    setFase('espera')
    // Mock — simular búsqueda de 2s
    setTimeout(() => {
      setRival(MOCHI_MOCK)
      setTimeout(() => setFase('batalla'), 1500)
    }, 2000)
  }

  const usarHabilidad = (habilidadId: string) => {
    // TODO: llamar API POST /batalla/accion
    console.log('Usando habilidad:', habilidadId)
  }

  const cancelarBusqueda = () => setFase('preparacion')

  const volverLobby = () => {
    setFase('lobby')
    setRival(null)
    setResultado(null)
    setConsumibles(CONSUMIBLES_TIENDA)
    setEstadoBatalla({
      turno: 1,
      esMiTurno: true,
      hpJugador: TOFU_MOCK.stats.hp,
      hpMaxJugador: TOFU_MOCK.stats.hp,
      hpRival: MOCHI_MOCK.stats.hp,
      hpMaxRival: MOCHI_MOCK.stats.hp,
      nrgJugador: 100,
      escudoActivo: false,
      log: ['¡La batalla comienza!'],
      ganador: null
    })
  }

  const totalTFGastado = consumibles.reduce(
    (acc, c) => acc + c.precio * c.cantidad, 0
  )

  return {
    fase, setFase,
    modo, setModo,
    tfDisponible,
    consumibles,
    comprarConsumible,
    devolverConsumible,
    buscarRival,
    cancelarBusqueda,
    rival,
    estadoBatalla,
    usarHabilidad,
    resultado,
    volverLobby,
    totalTFGastado,
    tokagotchi: TOFU_MOCK
  }
}