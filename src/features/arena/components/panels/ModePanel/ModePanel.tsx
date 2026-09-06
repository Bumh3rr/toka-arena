import type { CSSProperties } from 'react'
import { Label, TOKENS } from '@/shared/ui/Kit'
import { IcBolt, IcCheck, IcSkull } from '@/shared/ui/Icons/Icons'
import { ARENA_MODES, ARENA_MODE_ORDER } from '../../../constants/modes'
import type { ArenaMode, ModeReward } from '../../../types/arena.types'
import styles from './ModePanel.module.css'

interface ModePanelProps {
  selected: ArenaMode
  onSelect: (mode: ArenaMode) => void
}

/** Icono del chip de recompensa. La moneda es un asset; el resto, UIKit. */
function RewardIcon({ kind }: { kind: ModeReward['kind'] }) {
  if (kind === 'tf') return <img src="/assets/ui/tf/tf.svg" alt="" className={styles.rewardCoin} />
  if (kind === 'xp') return <IcBolt />
  return <IcSkull />
}

/**
 * Selector de arena.
 *
 * Cada modo se lee del catálogo `ARENA_MODES`, así que añadir uno nuevo lo
 * hace aparecer aquí sin tocar este componente. Los modos deshabilitados se
 * pueden elegir para previsualizar su arena — lo que se bloquea es pelear.
 */
export default function ModePanel({ selected, onSelect }: ModePanelProps) {
  return (
    <div className={styles.panel}>
      <header className={styles.head}>
        <h2 className={styles.title}>Elige tu arena</h2>
        <p className={styles.sub}>Tu Tokagotchi ya está calentando.</p>
      </header>

      <div className={styles.list}>
        {ARENA_MODE_ORDER.map((id) => {
          const mode = ARENA_MODES[id]
          const isSelected = id === selected
          const accent = TOKENS[mode.accent]

          const cardVars = {
            '--mode-accent': accent.bg,
            '--mode-accent-edge': accent.edge,
            '--mode-accent-soft': accent.softBg ?? accent.bg,
          } as CSSProperties

          return (
            <button
              key={id}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              style={cardVars}
              onClick={() => onSelect(id)}
              aria-pressed={isSelected}
            >
              {/* Banner de la arena, con la copa rompiendo el marco */}
              <div className={styles.banner}>
                <img src={mode.banner} alt="" className={styles.bannerImg} />

                <div className={styles.badges}>
                  {isSelected && (
                    <Label variant={mode.accent} size="xs" uppercase className={styles.chosen}>
                      <span className={styles.chosenIcon}><IcCheck /></span>
                      Elegido
                    </Label>
                  )}
                  {!mode.enabled && (
                    <Label variant="cream" look="soft" size="xs" uppercase>
                      Próximamente
                    </Label>
                  )}
                </div>

                <img src={mode.cup} alt="" className={styles.cup} />
              </div>

              {/* Placa con el nombre, la promesa y las recompensas */}
              <div className={styles.plate}>
                <span className={styles.modeName}>Modo {mode.label}</span>
                <span className={styles.modeTagline}>{mode.tagline}</span>

                <div className={styles.rewards}>
                  {mode.rewards.map((reward) => (
                    <span key={reward.label} className={styles.reward}>
                      <RewardIcon kind={reward.kind} />
                      {reward.label}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
