import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/shared/ui/Kit'
import Loading from '@/shared/ui/Loading/Loading'
import PageError from '@/shared/ui/Error/Error'
import { usePlayer } from '@/shared/player/hooks/usePlayer'
import { useNavBar } from '@/shared/hooks/useNavBar'

import { getSpeciesImageSrc } from '@/shared/game/assets'

import ArenaBackdrop from '../../components/ArenaBackdrop/ArenaBackdrop'
import SignPill from '../../components/SignPill/SignPill'
import PulseRings from '../../components/PulseRings/PulseRings'
import InitiativeCoin, { type CoinFaceArt } from '../../components/InitiativeCoin/InitiativeCoin'
import SearchingToka from '../../components/SearchingToka/SearchingToka'
import MatchPreviewCard from '../../components/MatchPreviewCard/MatchPreviewCard'
import StatusMessageCard from '../../components/StatusMessageCard/StatusMessageCard'
import FloorCountdown from '../../components/FloorCountdown/FloorCountdown'
import GlyphMedallion from '../../components/GlyphMedallion/GlyphMedallion'
import { useMatchmaking } from '../../hooks/useMatchmaking'
import { matchmakingMock } from '../../lib/matchmakingMock'
import { getPortrait, portraitKey, setPortrait } from '../../lib/tokaPortrait'
import { ARENA_MODES } from '../../constants/modes'
import type { ArenaMode, MatchFighter, MatchFound } from '../../types/arena.types'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import styles from './MatchmakingSection.module.css'

interface MatchmakingSectionProps {
  mode: ArenaMode
  /** Volver al lobby: cancelar, salir sin rivales o rendirse ante el error. */
  onExit: () => void
  /** La cuenta atrás terminó: entra el combate. */
  onBattleStart: (match: MatchFound) => void
}

/**
 * Sección 2 del flujo de arena: buscar rival y resolver quién ataca primero.
 *
 * Las siete pantallas comparten una sola composición —rótulo colgado, pieza
 * central sobre el ruedo, tarjeta de estado abajo— y lo único que cambia entre
 * fases es qué ocupa cada hueco. Así nada salta de sitio al avanzar.
 *
 * La moneda no sortea nada: el orden de turno lo decide el servidor por SPD y
 * llega resuelto junto con el rival, así que el vuelo es la puesta en escena
 * de una respuesta que ya existe.
 */
export default function MatchmakingSection({
  mode,
  onExit,
  onBattleStart,
}: MatchmakingSectionProps) {
  const { state: playerState, reload } = usePlayer()
  const { hideBar, showBar } = useNavBar()

  // La búsqueda se toma la pantalla completa, igual que los paneles del lobby
  useEffect(() => {
    hideBar()
    return () => showBar()
  }, [hideBar, showBar])

  const tokagotchi =
    playerState.status === 'ready' ? playerState.data.mainTokagotchi : null

  if (playerState.status === 'loading') {
    return <Loading fullscreen text="Entrando a la cola..." />
  }
  if (playerState.status === 'error') {
    return <PageError message={playerState.error} onRetry={reload} />
  }
  if (!tokagotchi) {
    return (
      <PageError
        message="Necesitas un Tokagotchi para entrar a la arena."
        onRetry={onExit}
      />
    )
  }

  return (
    <Searching
      tokagotchi={tokagotchi}
      mode={mode}
      onExit={onExit}
      onBattleStart={onBattleStart}
    />
  )
}

/**
 * Cuerpo de la sección, ya con un Tokagotchi confirmado.
 *
 * Va aparte para que `useMatchmaking` —que entra a la cola en cuanto se
 * monta— no arranque antes de saber con qué se pelea.
 */
function Searching({
  tokagotchi,
  mode,
  onExit,
  onBattleStart,
}: { tokagotchi: Tokagotchi } & MatchmakingSectionProps) {
  // Nuestro lado del emparejamiento: el hook lo compone con el del rival
  const me: MatchFighter = useMemo(
    () => ({
      name: tokagotchi.name,
      species: tokagotchi.species,
      rarity: tokagotchi.rarity,
    }),
    [tokagotchi],
  )

  /*
   * Cara de la moneda: el Tokagotchi vestido, capturado del canvas.
   *
   * Sale ya resuelta del lobby en el caso normal. El canvas de esta sección la
   * vuelve a intentar por si el jugador entró directo, y si tampoco llega
   * —emparejamiento instantáneo, renderer sin capturas— la moneda cae al
   * retrato plano de la especie y el volado funciona igual.
   */
  const key = portraitKey(tokagotchi.species, tokagotchi.equipped)
  const [portrait, setPortraitState] = useState<string | null>(() => getPortrait(key))

  const handlePortrait = useCallback(
    (dataUrl: string) => {
      setPortrait(key, dataUrl)
      setPortraitState(dataUrl)
    },
    [key],
  )

  const playerFace: CoinFaceArt = portrait
    ? { kind: 'snapshot', src: portrait }
    : { kind: 'species', src: getSpeciesImageSrc(tokagotchi.species) }

  const theme = ARENA_MODES[mode]

  const { state, retry } = useMatchmaking({ me, driver: matchmakingMock, onBattleStart })

  return (
    <section className={styles.section}>
      <ArenaBackdrop mode={mode} />

      <div className={styles.content}>
        <div className={styles.sky}>
          {renderSign()}
          <div className={styles.center}>{renderCenter()}</div>
        </div>

        <div className={styles.ground}>{renderFooter()}</div>

        {/*
         * Franja de arena descubierta. Existe siempre, aunque esté vacía: es
         * la que deja la moneda apoyada en el ruedo y no flotando en el aire,
         * y la que le da sitio a la cuenta atrás sin recolocar nada.
         */}
        <div className={styles.floor}>
          {state.phase === 'RESULT' && <FloorCountdown value={state.countdown} />}
        </div>
      </div>
    </section>
  )

  // ── Qué ocupa cada hueco en cada fase ───────────────────────────────────

  function renderSign() {
    switch (state.phase) {
      case 'SEARCHING':
        return <SignPill>Buscando rival</SignPill>
      case 'FOUND':
        return <SignPill look="title">¡Rival encontrado!</SignPill>
      case 'FLIGHT':
        return <SignPill>{state.landing ? 'Cayendo...' : 'Volado de iniciativa'}</SignPill>
      case 'RESULT':
        return <SignPill>Iniciativa resuelta</SignPill>
      default:
        // Sin rivales y error de red no narran nada: la tarjeta ya lo dice todo
        return null
    }
  }

  function renderCenter() {
    switch (state.phase) {
      case 'SEARCHING':
        return (
          <>
            <PulseRings />
            <SearchingToka
              tokagotchi={tokagotchi}
              aura={theme.aura}
              onPortrait={handlePortrait}
            />
          </>
        )

      case 'FOUND':
        return <MatchPreviewCard match={state.match} />

      case 'FLIGHT':
      case 'RESULT': {
        const { match } = state
        return (
          <>
            {/* Los anillos acompañan el giro y se apagan al empezar a caer */}
            {state.phase === 'FLIGHT' && !state.landing && <PulseRings />}
            <InitiativeCoin
              player={playerFace}
              cupSrc={theme.cup}
              meFirst={match.firstIsMe}
            />
          </>
        )
      }

      case 'EMPTY':
        return <GlyphMedallion glyph="?" tone="calm" label="Sin rivales" />

      case 'ERROR':
        return <GlyphMedallion glyph="!" tone="alert" label="Error de conexión" />
    }
  }

  function renderFooter() {
    switch (state.phase) {
      case 'SEARCHING':
        return (
          <StatusMessageCard
            title="Buscando rival"
            description={`${state.waitingSeconds}s en la arena · ${state.playersInQueue} en la cola`}
          >
            <Button variant="cream" size="md" radius="lg" fullWidth onClick={onExit}>
              Cancelar búsqueda
            </Button>
          </StatusMessageCard>
        )

      case 'FOUND':
        return <SignPill look="note">Se lanza el volado de iniciativa...</SignPill>

      case 'FLIGHT':
        // Al caer no se dice nada: la moneda es lo único que importa
        return state.landing ? null : (
          <StatusMessageCard
            title="Si cae tu Tokagotchi, abres tú"
            description="Del otro lado está la copa de la arena"
          />
        )

      case 'RESULT':
        return (
          <StatusMessageCard
            title={state.match.firstIsMe ? '¡Atacas primero!' : 'El rival ataca primero'}
            description="El orden se mantiene toda la batalla"
          />
        )

      case 'EMPTY':
        return (
          <StatusMessageCard
            title="No hay rivales ahorita"
            description="La arena está tranquila. No gastaste estamina."
          >
            <Button variant="legend" size="lg" radius="lg" fullWidth onClick={retry}>
              Buscar de nuevo
            </Button>
            <Button variant="cream" size="md" radius="lg" fullWidth onClick={onExit}>
              Volver al Lobby
            </Button>
          </StatusMessageCard>
        )

      case 'ERROR':
        return (
          <StatusMessageCard
            title={state.message}
            description="No perdiste estamina. Revisa tus datos y vuelve a entrar."
          >
            <Button variant="danger" size="lg" radius="lg" fullWidth onClick={retry}>
              Reintentar
            </Button>
            <Button variant="cream" size="md" radius="lg" fullWidth onClick={onExit}>
              Volver al Lobby
            </Button>
          </StatusMessageCard>
        )
    }
  }
}
