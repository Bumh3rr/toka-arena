import { Label } from '@/shared/ui/Kit'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import type { AnimationTokagotchi, EquippedAccessory } from '@/shared/domain/tokagotchi'
import {
  FATIGUE_FROM_TURN,
  FATIGUE_HEAVY_FROM_TURN,
} from '../../../constants/battle'
import type { BattleFighter } from '../../../types/arena.types'
import type { HpFlash } from '../../../hooks/useBattle'
import styles from './BattleStage.module.css'

interface BattleStageProps {
  background: string
  me: BattleFighter
  rival: BattleFighter
  /** Accesorios del jugador. Del rival no llegan en el contrato. */
  myAccessories: EquippedAccessory[]
  myAnimation: AnimationTokagotchi
  rivalAnimation: AnimationTokagotchi
  currentTurn: number
  /** Rótulo de quién juega, bajo el ruedo. */
  turnLabel: string
  isMyTurn: boolean
  /** Cambios de vida del último golpe, para los números flotantes. */
  flashes: HpFlash[]
}

/** Alto del canvas de cada lado. El rival va más chico: está más lejos. */
const MY_SIZE = 190
const RIVAL_SIZE = 140

/**
 * El ruedo: los dos Tokagotchis peleando sobre el fondo del modo.
 *
 * El jugador va abajo a la izquierda y el rival arriba a la derecha, con menos
 * tamaño para leer la profundidad. El del jugador se espeja (`reverse`) para
 * que los dos se miren en lugar de darse la espalda.
 *
 * El rival se dibuja **sin accesorios**: `FighterStateResponse` solo manda
 * especie y nombre. En cuanto el backend exponga su equipamiento, entra por la
 * misma prop que ya usa el del jugador.
 */
export default function BattleStage({
  background,
  me,
  rival,
  myAccessories,
  myAnimation,
  rivalAnimation,
  currentTurn,
  turnLabel,
  isMyTurn,
  flashes,
}: BattleStageProps) {
  const fatigue = currentTurn >= FATIGUE_FROM_TURN
  const heavyFatigue = currentTurn >= FATIGUE_HEAVY_FROM_TURN

  return (
    /*
     * El ruedo recorta (para que el fondo no se salga de las esquinas) pero la
     * placa de turno tiene que cabalgar su borde inferior, así que vive fuera
     * del recorte, en este envoltorio.
     */
    <div className={styles.wrap}>
      <div className={styles.stage} style={{ backgroundImage: `url('${background}')` }}>
      {/*
       * Contador de turno. No lleva "de 15": no hay límite de turnos — el 15
       * es donde empieza la fatiga, que es lo que sí se avisa aparte.
       */}
      <div className={styles.hud}>
        <Label variant="cream" look="soft" size="xs" uppercase>
          Turno {currentTurn}
        </Label>

        {fatigue && (
          <Label variant="danger" look="soft" size="xs" uppercase>
            {heavyFatigue ? 'Fatiga intensa' : 'Fatiga'}
          </Label>
        )}
      </div>

      {/* Rival — al fondo a la derecha */}
      <div className={`${styles.slot} ${styles.slotRival}`}>
        <Flashes flashes={flashes} playerId={rival.playerId} />
        <TokagotchiCanvas
          key={`rival-${rival.species}`}
          species={rival.species}
          animacionActual={rivalAnimation}
          width={RIVAL_SIZE}
          height={RIVAL_SIZE}
        />
      </div>

      {/* Jugador — al frente a la izquierda, mirando al rival */}
      <div className={`${styles.slot} ${styles.slotMe}`}>
        <Flashes flashes={flashes} playerId={me.playerId} />
        <TokagotchiCanvas
          key={`me-${me.species}`}
          species={me.species}
          accessories={myAccessories}
          animacionActual={myAnimation}
          reverse
          width={MY_SIZE}
          height={MY_SIZE}
        />
      </div>

      </div>

      <div className={`${styles.turn} ${isMyTurn ? styles.turnMine : ''}`}>{turnLabel}</div>
    </div>
  )
}

/** Números que suben sobre un combatiente al perder o recuperar vida. */
function Flashes({ flashes, playerId }: { flashes: HpFlash[]; playerId: string }) {
  const mine = flashes.filter((flash) => flash.playerId === playerId)
  if (mine.length === 0) return null

  return (
    <div className={styles.flashes} aria-hidden="true">
      {mine.map((flash) => (
        <span
          key={flash.key}
          className={`${styles.flash} ${flash.delta < 0 ? styles.flashDamage : styles.flashHeal}`}
        >
          {flash.delta > 0 ? `+${flash.delta}` : flash.delta}
        </span>
      ))}
    </div>
  )
}
