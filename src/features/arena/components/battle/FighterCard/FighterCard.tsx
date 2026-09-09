import { Card, ProgressBar } from '@/shared/ui/Kit'
import { SPECIES_LABEL } from '@/shared/constants/tokagotchi'
import { RARITY_META } from '@/shared/constants/rarity'
import type { Rarity } from '@/shared/domain/tokagotchi'
import { CRITICAL_HP_PCT } from '../../../constants/battle'
import TurnRing from '../TurnRing/TurnRing'
import StatusChips from '../StatusChips/StatusChips'
import EnergyPips from '../EnergyPips/EnergyPips'
import type { BattleFighter } from '../../../types/arena.types'
import styles from './FighterCard.module.css'

interface FighterCardProps {
  fighter: BattleFighter
  /** Retrato del combatiente para el anillo. */
  portraitSrc: string
  /** `me` pinta el punto morado; `rival`, el azul. Igual que en el volado. */
  side: 'me' | 'rival'
  /** Dueño del Tokagotchi. Del rival no siempre lo manda el contrato. */
  username?: string
  /** Del rival tampoco llega la rareza. */
  rarity?: Rarity
  /** Tiene el turno: le sale el anillo con la cuenta atrás. */
  active: boolean
  secondsLeft: number
  /** Energía que gastaría la habilidad seleccionada, para previsualizarla. */
  energyPreview?: number
}

/**
 * Ficha de un combatiente: quién es, cuánta vida y energía le queda y qué
 * efectos lleva encima.
 *
 * Es la misma pieza arriba y abajo. Del rival faltan dueño y rareza —
 * `FighterStateResponse` solo trae nombre y especie—, así que la leyenda se
 * arma con lo que exista en lugar de rellenar huecos.
 */
export default function FighterCard({
  fighter,
  portraitSrc,
  side,
  username,
  rarity,
  active,
  secondsLeft,
  energyPreview,
}: FighterCardProps) {
  const hpPct = (fighter.currentHp / Math.max(1, fighter.maxHp)) * 100
  const critical = hpPct <= CRITICAL_HP_PCT

  const caption = [username, SPECIES_LABEL[fighter.species], rarity && RARITY_META[rarity].label]
    .filter(Boolean)
    .join(' · ')

  return (
    <Card padding="sm" radius="lg" className={`${styles.card} ${critical ? styles.critical : ''}`}>
      <TurnRing
        src={portraitSrc}
        secondsLeft={secondsLeft}
        active={active}
        label={`Turno de ${fighter.name}`}
      />

      <div className={styles.body}>
        <div className={styles.identity}>
          <span className={`${styles.dot} ${side === 'me' ? styles.dotMe : styles.dotRival}`} />
          <span className={styles.name}>{fighter.name}</span>
          {caption && <span className={styles.caption}>{caption}</span>}
        </div>

        <div className={styles.gauge}>
          <span className={styles.tag}>HP</span>
          <ProgressBar
            className={styles.bar}
            pct={hpPct}
            height={13}
            color={
              critical
                ? 'linear-gradient(180deg,#F58A8A,#E85454)'
                : 'linear-gradient(180deg,#8FD96A,var(--green))'
            }
          />
          <span className={styles.value}>
            {fighter.currentHp}/{fighter.maxHp}
          </span>
        </div>

        <div className={styles.gauge}>
          <span className={styles.tag}>NRG</span>
          <EnergyPips value={fighter.currentEnergy} preview={energyPreview} />
          <span className={styles.value}>{fighter.currentEnergy}</span>
        </div>

        <StatusChips effects={fighter.status} />
      </div>
    </Card>
  )
}
