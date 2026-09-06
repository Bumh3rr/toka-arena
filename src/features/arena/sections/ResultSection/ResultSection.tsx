import { useEffect } from 'react'
import { Button } from '@/shared/ui/Kit'
import Loading from '@/shared/ui/Loading/Loading'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import { useNavBar } from '@/shared/hooks/useNavBar'

import ArenaBackdrop from '../../components/ArenaBackdrop/ArenaBackdrop'
import VerdictBanner from '../../components/result/VerdictBanner/VerdictBanner'
import RewardTally from '../../components/result/RewardTally/RewardTally'
import AftermathRow from '../../components/result/AftermathRow/AftermathRow'
import { useBattleRewards } from '../../hooks/useBattleRewards'
import { RESULT_THEMES } from '../../constants/results'
import type { ArenaMode, BattleResult } from '../../types/arena.types'
import styles from './ResultSection.module.css'

interface ResultSectionProps {
  mode: ArenaMode
  result: BattleResult
  onExit: () => void
}

/** Alto del canvas del Tokagotchi. */
const TOKA_SIZE = 190

/** Confeti de la victoria: posiciones fijas, para que no salte en cada render. */
const CONFETTI = [6, 17, 28, 39, 47, 58, 66, 74, 83, 92]

/**
 * Sección 5: cómo terminó y qué te llevas.
 *
 * La pantalla se pinta entera leyendo `RESULT_THEMES[kind]`, igual que el lobby
 * lee `ARENA_MODES`: añadir un desenlace es añadir una entrada.
 *
 * El backend **no manda las recompensas**, así que no se anuncian de memoria:
 * se deducen comparando el perfil de antes del combate con el de después. Y la
 * estamina se cobra al terminar, no al entrar a la cola, así que este es el
 * primer sitio donde el jugador ve el cargo.
 *
 * Un solo botón, a propósito: no existe endpoint de revancha en el backend
 * (`BattleController` solo tiene consulta, abandono e historial), y ofrecer un
 * botón que no lleva a ningún lado es peor que no ofrecerlo.
 */
export default function ResultSection({ mode, result, onExit }: ResultSectionProps) {
  const { hideBar, showBar } = useNavBar()
  const rewards = useBattleRewards(result.kind, result.before)

  useEffect(() => {
    hideBar()
    return () => showBar()
  }, [hideBar, showBar])

  if (rewards.status === 'loading') {
    return <Loading fullscreen text="Contando la recompensa..." />
  }

  const theme = RESULT_THEMES[result.kind]
  const tokagotchi = rewards.profile.mainTokagotchi

  return (
    <section className={styles.section}>
      <ArenaBackdrop mode={mode} />
      <div className={styles.scrim} aria-hidden="true" />

      {/* Rayos girando: solo detrás de lo que se celebra */}
      {theme.rays && (
        <div className={styles.rays} style={{ ['--rays-glow' as string]: theme.glow }} aria-hidden="true" />
      )}

      {theme.confetti && (
        <div className={styles.confetti} aria-hidden="true">
          {CONFETTI.map((left, i) => (
            <span
              key={left}
              className={styles.fleck}
              style={{ left: `${left}%`, animationDelay: `${i * 0.28}s` }}
            />
          ))}
        </div>
      )}

      <div className={styles.content}>
        <VerdictBanner theme={theme} turns={result.turns} rivalName={result.rivalName} />

        <div className={styles.stage}>
          {tokagotchi && (
            <TokagotchiCanvas
              key={tokagotchi.species}
              species={tokagotchi.species}
              accessories={tokagotchi.equipped}
              animacionActual={theme.animation}
              width={TOKA_SIZE}
              height={TOKA_SIZE}
            />
          )}
        </div>

        <div className={styles.summary}>
          <RewardTally
            lead={theme.rewardLead}
            tf={rewards.rewards.tf}
            cp={rewards.rewards.cp}
            tfTotal={rewards.tfTotal}
          />

          <AftermathRow stamina={rewards.stamina} />

          <Button variant={theme.accent} size="lg" radius="lg" fullWidth onClick={onExit}>
            Volver al Lobby
          </Button>
        </div>
      </div>
    </section>
  )
}
