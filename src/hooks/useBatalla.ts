import { useEffect, useRef, useState } from 'react'
import type{
  ModoBatalla,
  FaseBatalla,
  Consumible,
  EstadoBatalla,
  ResultadoBatalla
} from '../types/batalla'
import { CONSUMIBLES_TIENDA } from '../constants/consumibles'
import type{ Tokagotchi, TokagotchiAnimacion } from '../types/toka'
import { TOFU_MOCK, MOCHI_MOCK, HANA_MOCK } from '../constants/tokagotchis'
import { userService } from '../services/userService'
import { mapResponseToTokagotchi } from '../services/tokagotchiService'

export function useBatalla() {
  const [tokagotchi, setTokagotchi] = useState<Tokagotchi>(TOFU_MOCK)
  const rivalesDisponibles = [MOCHI_MOCK, HANA_MOCK]

  const [fase, setFase] = useState<FaseBatalla>('lobby')
  const [modo, setModo] = useState<ModoBatalla>('normal')
  const [tfDisponible, setTfDisponible] = useState(30)
  const [consumibles, setConsumibles] = useState<Consumible[]>(CONSUMIBLES_TIENDA)
  const [rival, setRival] = useState<Tokagotchi | null>(null)
  const [resultado, setResultado] = useState<ResultadoBatalla | null>(null)
  const [animacionJugador, setAnimacionJugador] = useState<TokagotchiAnimacion>('idle')
  const [animacionRival, setAnimacionRival] = useState<TokagotchiAnimacion>('idle')

  const [estadoBatalla, setEstadoBatalla] = useState<EstadoBatalla>({
    turno: 1,
    esMiTurno: true,
    hpJugador: tokagotchi.stats.hp,
    hpMaxJugador: tokagotchi.stats.hp,
    hpRival: MOCHI_MOCK.stats.hp,
    hpMaxRival: MOCHI_MOCK.stats.hp,
    nrgJugador: 100,
    escudoActivo: false,
    log: ['¡La batalla comienza!'],
    ganador: null
  })

  const estadoRef = useRef<EstadoBatalla>(estadoBatalla)
  const consumiblesRef = useRef<Consumible[]>(consumibles)
  const rivalActualRef = useRef<Tokagotchi>(MOCHI_MOCK)
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const rivalNrgRef = useRef(100)
  const shieldTurnsRef = useRef(0)
  const playerAtkBuffTurnsRef = useRef(0)
  const rivalDefDebuffTurnsRef = useRef(0)
  const playerDefDebuffTurnsRef = useRef(0)
  const rivalEvasionReadyRef = useRef(false)
  const danoTotalRef = useRef(0)

  useEffect(() => {
    estadoRef.current = estadoBatalla
  }, [estadoBatalla])

  useEffect(() => {
    consumiblesRef.current = consumibles
  }, [consumibles])

  useEffect(() => {
    let cancelled = false

    const fetchTokagotchiActivo = async () => {
      try {
        const me = await userService.getMe()
        if (cancelled || !me?.tokagotchiActivo) return

        const tokaActivo = mapResponseToTokagotchi(me.tokagotchiActivo)
        setTokagotchi(tokaActivo)
        setTfDisponible(typeof me.tf === 'number' ? me.tf : 30)

        if (fase === 'lobby' || fase === 'preparacion' || fase === 'espera') {
          setEstadoBatalla((prev) => ({
            ...prev,
            hpJugador: tokaActivo.stats.hp,
            hpMaxJugador: tokaActivo.stats.hp
          }))
        }
      } catch (err) {
        console.error('Error cargando tokagotchi activo en batalla:', err)
      }
    }

    fetchTokagotchiActivo()

    return () => {
      cancelled = true
    }
  }, [fase])

  useEffect(() => {
    return () => clearAllTimers()
  }, [])

  const clearAllTimers = () => {
    timersRef.current.forEach((timerId) => clearTimeout(timerId))
    timersRef.current = []
  }

  const schedule = (callback: () => void, delayMs: number) => {
    const timerId = setTimeout(() => {
      timersRef.current = timersRef.current.filter((id) => id !== timerId)
      callback()
    }, delayMs)

    timersRef.current.push(timerId)
  }

  const triggerAnimacionJugador = (animacion: TokagotchiAnimacion, durationMs = 550) => {
    setAnimacionJugador(animacion)
    schedule(() => setAnimacionJugador('idle'), durationMs)
  }

  const triggerAnimacionRival = (animacion: TokagotchiAnimacion, durationMs = 550) => {
    setAnimacionRival(animacion)
    schedule(() => setAnimacionRival('idle'), durationMs)
  }

  const commitEstado = (nextState: EstadoBatalla) => {
    estadoRef.current = nextState
    setEstadoBatalla(nextState)
  }

  const pushLog = (baseLog: string[], message: string) => {
    return [...baseLog, message].slice(-6)
  }

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const clampHp = (value: number, maxHp: number) => {
    return Math.max(0, Math.min(maxHp, Math.round(value)))
  }

  const resetCombatRuntime = () => {
    rivalNrgRef.current = 100
    shieldTurnsRef.current = 0
    playerAtkBuffTurnsRef.current = 0
    rivalDefDebuffTurnsRef.current = 0
    playerDefDebuffTurnsRef.current = 0
    rivalEvasionReadyRef.current = false
    danoTotalRef.current = 0
    setAnimacionJugador('idle')
    setAnimacionRival('idle')
  }

  const finalizarBatalla = (ganador: 'jugador' | 'rival', finalState: EstadoBatalla) => {
    const hpRestante = ganador === 'jugador' ? finalState.hpJugador : finalState.hpRival
    const recompensaTF = ganador === 'jugador'
      ? (modo === 'normal' ? randomInt(1, 2) : randomInt(4, 6))
      : 0

    const stateWithWinner: EstadoBatalla = {
      ...finalState,
      ganador,
      log: pushLog(finalState.log, ganador === 'jugador' ? 'Ganaste la batalla.' : 'Tu rival ganó la batalla.')
    }

    commitEstado(stateWithWinner)
    setResultado({
      ganador,
      turnos: finalState.turno,
      danoTotal: danoTotalRef.current,
      hpRestante,
      recompensaTF,
      modo
    })
    setFase(ganador === 'jugador' ? 'victoria' : 'derrota')
  }

  const calcularDanioJugador = (multiplicador: number, ignoraDefensa = false) => {
    const rivalActual = rivalActualRef.current
    const ataqueBase = tokagotchi.stats.atk * (playerAtkBuffTurnsRef.current > 0 ? 1.15 : 1)
    const defensaRival = ignoraDefensa
      ? 0
      : rivalActual.stats.def * (rivalDefDebuffTurnsRef.current > 0 ? 0.8 : 1)

    return Math.max(6, Math.round(ataqueBase * multiplicador - defensaRival * 0.25 + randomInt(-2, 2)))
  }

  const calcularDanioRival = (multiplicador: number, ignoraDefensa = false) => {
    const rivalActual = rivalActualRef.current
    const ataqueBase = rivalActual.stats.atk
    const defensaJugador = ignoraDefensa
      ? 0
      : tokagotchi.stats.def * (playerDefDebuffTurnsRef.current > 0 ? 0.8 : 1)

    let danio = Math.max(5, Math.round(ataqueBase * multiplicador - defensaJugador * 0.25 + randomInt(-2, 2)))

    if (shieldTurnsRef.current > 0) {
      danio = Math.round(danio * 0.7)
      shieldTurnsRef.current = Math.max(0, shieldTurnsRef.current - 1)
    }

    return danio
  }

  const pasarATurnoRival = (stateAfterAction: EstadoBatalla) => {
    const stateWithTurnSwap: EstadoBatalla = {
      ...stateAfterAction,
      turno: stateAfterAction.turno + 1,
      esMiTurno: false,
      escudoActivo: shieldTurnsRef.current > 0,
      log: pushLog(stateAfterAction.log, 'Turno del rival (+10 NRG).')
    }

    rivalNrgRef.current = Math.min(100, rivalNrgRef.current + 10)
    commitEstado(stateWithTurnSwap)
    schedule(ejecutarTurnoRival, 900)
  }

  const jugadorTieneAcciones = (state: EstadoBatalla) => {
    const hayHabilidad = tokagotchi.habilidades.some((hab) => hab.costoNRG <= state.nrgJugador)
    const hayConsumibles = consumiblesRef.current.some((item) => item.cantidad > 0)
    return hayHabilidad || hayConsumibles
  }

  const autoSaltarTurnoJugador = () => {
    const currentState = estadoRef.current
    if (fase !== 'batalla' || !currentState.esMiTurno || currentState.ganador) return
    if (jugadorTieneAcciones(currentState)) return

    const nextState: EstadoBatalla = {
      ...currentState,
      log: pushLog(currentState.log, 'Sin NRG ni consumibles. Se salta tu turno automáticamente.')
    }

    pasarATurnoRival(nextState)
  }

  const pasarTurnoJugador = () => {
    const currentState = estadoRef.current
    if (fase !== 'batalla' || !currentState.esMiTurno || currentState.ganador) return

    const nextState: EstadoBatalla = {
      ...currentState,
      log: pushLog(currentState.log, 'Decidiste pasar tu turno.')
    }

    pasarATurnoRival(nextState)
  }

  const pasarATurnoJugador = (stateAfterAction: EstadoBatalla) => {
    const stateWithTurnSwap: EstadoBatalla = {
      ...stateAfterAction,
      turno: stateAfterAction.turno + 1,
      esMiTurno: true,
      nrgJugador: Math.min(100, stateAfterAction.nrgJugador + 10),
      escudoActivo: shieldTurnsRef.current > 0,
      log: pushLog(stateAfterAction.log, 'Tu turno (+10 NRG).')
    }

    commitEstado(stateWithTurnSwap)
    schedule(autoSaltarTurnoJugador, 500)
  }

  const ejecutarTurnoRival = () => {
    if (fase !== 'batalla') return

    const currentState = estadoRef.current
    if (currentState.ganador || currentState.esMiTurno || !rival) return

    const rivalActual = rivalActualRef.current

    const habilidadesDisponibles = rival.habilidades.filter((hab) => hab.costoNRG <= rivalNrgRef.current)
    const habilidadElegida = habilidadesDisponibles.length > 0
      ? habilidadesDisponibles[randomInt(0, habilidadesDisponibles.length - 1)]
      : null

    let nextState = { ...currentState }
    let newLog = nextState.log

    if (!habilidadElegida) {
      const danio = calcularDanioRival(1)
      const hpJugadorNuevo = clampHp(nextState.hpJugador - danio, nextState.hpMaxJugador)
      nextState.hpJugador = hpJugadorNuevo
      triggerAnimacionRival('attack')
      triggerAnimacionJugador('hurt')
      newLog = pushLog(newLog, `${rivalActual.nombre} ataca y te hace ${danio} de daño.`)
    } else {
      rivalNrgRef.current = Math.max(0, rivalNrgRef.current - habilidadElegida.costoNRG)

      switch (habilidadElegida.id) {
        case 'zarpazo': {
          const ignoraDef = Math.random() < 0.2
          const danio = calcularDanioRival(0.9, ignoraDef)
          nextState.hpJugador = clampHp(nextState.hpJugador - danio, nextState.hpMaxJugador)
          triggerAnimacionRival('attack')
          triggerAnimacionJugador('hurt')
          newLog = pushLog(
            newLog,
            `${rivalActual.nombre} usa ${habilidadElegida.nombre} y causa ${danio} de daño${ignoraDef ? ' (ignoró defensa)' : ''}.`
          )
          break
        }
        case 'agilidad': {
          rivalEvasionReadyRef.current = true
          triggerAnimacionRival('play')
          newLog = pushLog(newLog, `${rivalActual.nombre} usa ${habilidadElegida.nombre}. Preparó evasión para tu próximo ataque.`)
          break
        }
        case 'bufido': {
          playerDefDebuffTurnsRef.current = 2
          triggerAnimacionRival('play')
          newLog = pushLog(newLog, `${rivalActual.nombre} usa ${habilidadElegida.nombre}. Tu defensa bajó por 2 turnos.`)
          break
        }
        case 'frenesi': {
          const hit1 = calcularDanioRival(0.7)
          const hit2 = calcularDanioRival(0.7)
          const total = hit1 + hit2
          nextState.hpJugador = clampHp(nextState.hpJugador - total, nextState.hpMaxJugador)
          triggerAnimacionRival('attack')
          triggerAnimacionJugador('hurt')
          newLog = pushLog(newLog, `${rivalActual.nombre} entra en ${habilidadElegida.nombre} y conecta ${total} de daño total.`)
          break
        }
        default: {
          const multiplicador = habilidadElegida.multiplicador ?? 1
          const danio = calcularDanioRival(multiplicador)
          nextState.hpJugador = clampHp(nextState.hpJugador - danio, nextState.hpMaxJugador)
          triggerAnimacionRival('attack')
          triggerAnimacionJugador('hurt')
          newLog = pushLog(newLog, `${rivalActual.nombre} usa ${habilidadElegida.nombre} y te hace ${danio} de daño.`)
          break
        }
      }
    }

    if (playerAtkBuffTurnsRef.current > 0) {
      playerAtkBuffTurnsRef.current = Math.max(0, playerAtkBuffTurnsRef.current - 1)
    }

    if (playerDefDebuffTurnsRef.current > 0) {
      playerDefDebuffTurnsRef.current = Math.max(0, playerDefDebuffTurnsRef.current - 1)
    }

    if (nextState.hpJugador <= 0) {
      finalizarBatalla('rival', {
        ...nextState,
        log: newLog,
        escudoActivo: shieldTurnsRef.current > 0
      })
      return
    }

    nextState.log = newLog
    pasarATurnoJugador(nextState)
  }

  const iniciarBatalla = (rivalEncontrado: Tokagotchi) => {
    rivalActualRef.current = rivalEncontrado
    resetCombatRuntime()
    clearAllTimers()

    const initialState: EstadoBatalla = {
      turno: 1,
      esMiTurno: true,
      hpJugador: tokagotchi.stats.hp,
      hpMaxJugador: tokagotchi.stats.hp,
      hpRival: rivalEncontrado.stats.hp,
      hpMaxRival: rivalEncontrado.stats.hp,
      nrgJugador: 100,
      escudoActivo: false,
      ganador: null,
      log: [
        `¡${tokagotchi.nombre} vs ${rivalEncontrado.nombre}!`,
        'Empiezas tú. Elige habilidad o consumible.'
      ]
    }

    commitEstado(initialState)
    setResultado(null)
    setFase('batalla')
  }

  const comprarConsumible = (id: string) => {
    const item = consumibles.find(c => c.id === id)
    if (!item) return

    const totalGastado = consumibles.reduce((acc, c) => acc + c.precio * c.cantidad, 0)
    if (totalGastado + item.precio > tfDisponible) return

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
    clearAllTimers()
    setResultado(null)
    setRival(null)

    const searchingState: EstadoBatalla = {
      ...estadoRef.current,
      turno: 1,
      esMiTurno: true,
      hpJugador: tokagotchi.stats.hp,
      hpMaxJugador: tokagotchi.stats.hp,
      hpRival: rivalActualRef.current.stats.hp,
      hpMaxRival: rivalActualRef.current.stats.hp,
      nrgJugador: 100,
      escudoActivo: false,
      ganador: null,
      log: ['Buscando rival...', 'Te emparejaremos pronto.']
    }

    commitEstado(searchingState)
    setFase('espera')

    schedule(() => {
      const rivalEncontrado = rivalesDisponibles[randomInt(0, rivalesDisponibles.length - 1)]
      rivalActualRef.current = rivalEncontrado
      setRival(rivalEncontrado)
      const foundState = {
        ...estadoRef.current,
        hpRival: rivalEncontrado.stats.hp,
        hpMaxRival: rivalEncontrado.stats.hp,
        log: pushLog(estadoRef.current.log, `Rival encontrado: ${rivalEncontrado.nombre}.`) 
      }
      commitEstado(foundState)

      schedule(() => iniciarBatalla(rivalEncontrado), 1200)
    }, 1400)
  }

  const usarHabilidad = (habilidadId: string) => {
    if (fase !== 'batalla') return

    const currentState = estadoRef.current
    if (!currentState.esMiTurno || currentState.ganador) return

    const habilidad = tokagotchi.habilidades.find((hab) => hab.id === habilidadId)
    if (!habilidad || currentState.nrgJugador < habilidad.costoNRG) return

    let nextState: EstadoBatalla = {
      ...currentState,
      nrgJugador: Math.max(0, currentState.nrgJugador - habilidad.costoNRG)
    }

    let nextLog = nextState.log
    let danioInfligido = 0

    switch (habilidad.id) {
      case 'ladrido': {
        playerAtkBuffTurnsRef.current = 2
        triggerAnimacionJugador('play')
        nextLog = pushLog(nextLog, `${tokagotchi.nombre} usa ${habilidad.nombre}. Ataque mejorado por 2 turnos.`)
        break
      }
      case 'guardia': {
        shieldTurnsRef.current = Math.max(shieldTurnsRef.current, 2)
        nextState.escudoActivo = true
        triggerAnimacionJugador('bath')
        nextLog = pushLog(nextLog, `${tokagotchi.nombre} usa ${habilidad.nombre}. Escudo activo por 2 turnos.`)
        break
      }
      case 'lealtad': {
        if (rivalEvasionReadyRef.current && Math.random() < 0.25) {
          rivalEvasionReadyRef.current = false
          triggerAnimacionJugador('attack')
          triggerAnimacionRival('play')
          nextLog = pushLog(nextLog, `${rivalActualRef.current.nombre} esquivó tu ${habilidad.nombre}.`)
          break
        }

        danioInfligido = calcularDanioJugador(habilidad.multiplicador ?? 1.4)
        nextState.hpRival = clampHp(nextState.hpRival - danioInfligido, nextState.hpMaxRival)
        danoTotalRef.current += danioInfligido
        triggerAnimacionJugador('attack')
        triggerAnimacionRival('hurt')
        nextLog = pushLog(nextLog, `${tokagotchi.nombre} usa ${habilidad.nombre} y causa ${danioInfligido} de daño.`)

        if (nextState.hpJugador <= nextState.hpMaxJugador * 0.3) {
          const curacion = Math.max(1, Math.round(danioInfligido * 0.2))
          nextState.hpJugador = clampHp(nextState.hpJugador + curacion, nextState.hpMaxJugador)
          triggerAnimacionJugador('heal')
          nextLog = pushLog(nextLog, `${tokagotchi.nombre} recupera ${curacion} HP por lealtad.`)
        }

        rivalEvasionReadyRef.current = false
        break
      }
      default: {
        if (rivalEvasionReadyRef.current && Math.random() < 0.25) {
          rivalEvasionReadyRef.current = false
          triggerAnimacionJugador('attack')
          triggerAnimacionRival('play')
          nextLog = pushLog(nextLog, `${rivalActualRef.current.nombre} esquivó tu ${habilidad.nombre}.`)
          break
        }

        danioInfligido = calcularDanioJugador(habilidad.multiplicador ?? 1)
        nextState.hpRival = clampHp(nextState.hpRival - danioInfligido, nextState.hpMaxRival)
        danoTotalRef.current += danioInfligido
        triggerAnimacionJugador('attack')
        triggerAnimacionRival('hurt')
        nextLog = pushLog(nextLog, `${tokagotchi.nombre} usa ${habilidad.nombre} y hace ${danioInfligido} de daño.`)
        rivalEvasionReadyRef.current = false
        break
      }
    }

    if (rivalDefDebuffTurnsRef.current > 0) {
      rivalDefDebuffTurnsRef.current = Math.max(0, rivalDefDebuffTurnsRef.current - 1)
    }

    if (nextState.hpRival <= 0) {
      finalizarBatalla('jugador', {
        ...nextState,
        log: nextLog,
        escudoActivo: shieldTurnsRef.current > 0
      })
      return
    }

    nextState.log = nextLog
    pasarATurnoRival(nextState)
  }

  const usarConsumible = (consumibleId: string) => {
    if (fase !== 'batalla') return

    const currentState = estadoRef.current
    if (!currentState.esMiTurno || currentState.ganador) return

    const item = consumibles.find((c) => c.id === consumibleId)
    if (!item || item.cantidad <= 0) return

    setConsumibles((prev) => prev.map((c) =>
      c.id === consumibleId ? { ...c, cantidad: c.cantidad - 1 } : c
    ))

    let nextState = { ...currentState }
    let nextLog = nextState.log

    switch (consumibleId) {
      case 'pocion_pequeña': {
        nextState.hpJugador = clampHp(nextState.hpJugador + 20, nextState.hpMaxJugador)
        triggerAnimacionJugador('feed')
        nextLog = pushLog(nextLog, 'Usaste Poción Pequeña (+20 HP).')
        break
      }
      case 'pocion_mediana': {
        nextState.hpJugador = clampHp(nextState.hpJugador + 50, nextState.hpMaxJugador)
        triggerAnimacionJugador('heal')
        nextLog = pushLog(nextLog, 'Usaste Poción Mediana (+50 HP).')
        break
      }
      case 'pocion_grande': {
        nextState.hpJugador = nextState.hpMaxJugador
        triggerAnimacionJugador('heal')
        nextLog = pushLog(nextLog, 'Usaste Poción Grande (HP completo).')
        break
      }
      case 'escudo': {
        shieldTurnsRef.current = Math.max(shieldTurnsRef.current, 2)
        nextState.escudoActivo = true
        triggerAnimacionJugador('bath')
        nextLog = pushLog(nextLog, 'Usaste Escudo (reducción de daño por 2 turnos).')
        break
      }
      default:
        return
    }

    nextState.log = nextLog
    pasarATurnoRival(nextState)
  }

  const cancelarBusqueda = () => {
    clearAllTimers()
    setRival(null)
    setFase('preparacion')
  }

  const volverLobby = () => {
    clearAllTimers()
    setFase('lobby')
    setModo('normal')
    setRival(null)
    setResultado(null)
    setConsumibles(CONSUMIBLES_TIENDA)
    resetCombatRuntime()

    const resetState: EstadoBatalla = {
      turno: 1,
      esMiTurno: true,
      hpJugador: tokagotchi.stats.hp,
      hpMaxJugador: tokagotchi.stats.hp,
      hpRival: rivalActualRef.current.stats.hp,
      hpMaxRival: rivalActualRef.current.stats.hp,
      nrgJugador: 100,
      escudoActivo: false,
      log: ['¡La batalla comienza!'],
      ganador: null
    }

    commitEstado(resetState)
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
    usarConsumible,
    pasarTurnoJugador,
    resultado,
    volverLobby,
    totalTFGastado,
    tokagotchi,
    animacionJugador,
    animacionRival
  }
}