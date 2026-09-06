import { useCallback, useState } from 'react'
import Loading from '@/shared/ui/Loading/Loading'
import { usePlayer } from '@/shared/player/hooks/usePlayer'
import LobbySection from '../sections/LobbySection/LobbySection'
import MatchmakingSection from '../sections/MatchmakingSection/MatchmakingSection'
import BattleSection from '../sections/BattleSection/BattleSection'
import ResultSection from '../sections/ResultSection/ResultSection'
import { useActiveBattle } from '../hooks/useActiveBattle'
import { DEFAULT_ARENA_MODE } from '../constants/modes'
import type { ArenaMode, ArenaPhase, BattleResult, MatchFound } from '../types/arena.types'
import styles from './ArenaPage.module.css'

/**
 * Pantalla de arena.
 *
 * Enruta la fase activa: cada fase es una sección independiente que se pinta a
 * pantalla completa. Aquí viven las cosas que sobreviven al cambio de sección
 * —el modo elegido, la batalla emparejada y su desenlace—, porque las
 * secciones siguientes las necesitan después de que la anterior se desmonte.
 *
 * Antes de nada comprueba si el jugador dejó un combate a medias: recargar la
 * app no debería costarle la pelea.
 */
export default function ArenaPage() {
  const [phase, setPhase] = useState<ArenaPhase>('LOBBY')
  const [mode, setMode] = useState<ArenaMode>(DEFAULT_ARENA_MODE)
  const [match, setMatch] = useState<MatchFound | null>(null)
  const [result, setResult] = useState<BattleResult | null>(null)

  const { state: playerState } = usePlayer()
  const playerId = playerState.status === 'ready' ? playerState.data.id : null

  // Un combate vivo manda sobre cualquier otra fase
  const resume = useCallback((found: MatchFound) => {
    setMatch(found)
    setPhase('BATTLE')
  }, [])

  const active = useActiveBattle({ myPlayerId: playerId, onFound: resume })

  const goLobby = useCallback(() => {
    setMatch(null)
    setResult(null)
    setPhase('LOBBY')
  }, [])

  const handleBattleStart = useCallback((found: MatchFound) => {
    setMatch(found)
    setPhase('BATTLE')
  }, [])

  const handleBattleFinish = useCallback((battleResult: BattleResult) => {
    setResult(battleResult)
    setPhase('RESULT')
  }, [])

  /*
   * No se pinta el lobby hasta saber si hay combate pendiente: enseñarlo y
   * saltar al ruedo medio segundo después sería un parpadeo, y peor, dejaría
   * pulsar "Batalla" contra un servidor que va a rechazarlo por tener ya una
   * batalla en curso.
   */
  if (active.status === 'checking') {
    return <Loading fullscreen text="Buscando combates en curso..." />
  }

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

      {phase === 'BATTLE' && match && (
        <BattleSection
          mode={mode}
          match={match}
          onExit={goLobby}
          onFinish={handleBattleFinish}
        />
      )}

      {phase === 'RESULT' && result && (
        <ResultSection mode={mode} result={result} onExit={goLobby} />
      )}
    </div>
  )
}

