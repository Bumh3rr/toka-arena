import { useCallback, useState } from 'react'
import LobbySection from '../sections/LobbySection/LobbySection'
import MatchmakingSection from '../sections/MatchmakingSection/MatchmakingSection'
import { DEFAULT_ARENA_MODE } from '../constants/modes'
import type { ArenaMode, ArenaPhase, MatchFound } from '../types/arena.types'
import styles from './ArenaPage.module.css'

/**
 * Pantalla de arena.
 *
 * Enruta la fase activa: cada fase es una sección independiente que se pinta a
 * pantalla completa. Aquí viven las dos cosas que sobreviven al cambio de
 * sección —el modo elegido y la batalla emparejada—, porque el escenario y el
 * combate las necesitan después de que el lobby se desmonte.
 *
 * Las secciones de batalla y resultados entran como casos nuevos del switch.
 */
export default function ArenaPage() {
  const [phase, setPhase] = useState<ArenaPhase>('LOBBY')
  const [mode, setMode] = useState<ArenaMode>(DEFAULT_ARENA_MODE)
  const [match, setMatch] = useState<MatchFound | null>(null)

  const goLobby = useCallback(() => {
    setMatch(null)
    setPhase('LOBBY')
  }, [])

  const handleBattleStart = useCallback((found: MatchFound) => {
    setMatch(found)
    setPhase('BATTLE')
  }, [])

  return (
    <div className={styles.page}>
      {phase === 'LOBBY' && (
        <LobbySection
          mode={mode}
          onModeChange={setMode}
          onSearchRival={() => setPhase('MATCHMAKING')}
        />
      )}

      {phase === 'MATCHMAKING' && (
        <MatchmakingSection
          mode={mode}
          onExit={goLobby}
          onBattleStart={handleBattleStart}
        />
      )}

      {/*
       * El escenario de batalla es la sección 4 y todavía no existe. La fase
       * ya está cableada de punta a punta: cuando llegue, sustituye este hueco
       * y recibe el `match` que dejó el volado.
       */}
      {phase === 'BATTLE' && (
        <BattlePlaceholder match={match} onExit={goLobby} />
      )}
    </div>
  )
}

/** Hueco de la sección 4, para que el flujo se pueda recorrer completo. */
function BattlePlaceholder({
  match,
  onExit,
}: {
  match: MatchFound | null
  onExit: () => void
}) {
  return (
    <div className={styles.placeholder}>
      <p className={styles.placeholderTitle}>Escenario de batalla</p>
      <p className={styles.placeholderText}>
        {match
          ? `${match.me.name} contra ${match.rival.name}. Abre ${
              match.firstIsMe ? match.me.name : match.rival.name
            }.`
          : 'Sin emparejamiento.'}
      </p>
      <button className={styles.placeholderButton} onClick={onExit}>
        Volver al Lobby
      </button>
    </div>
  )
}
