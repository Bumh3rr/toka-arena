import { Card } from '@/shared/ui/Kit'
import { SPECIES_LABEL } from '@/shared/constants/tokagotchi'
import { RARITY_META } from '@/shared/constants/rarity'
import { getSpeciesImageSrc } from '@/shared/game/assets'
import type { MatchFighter, MatchFound } from '../../types/arena.types'
import styles from './MatchPreviewCard.module.css'

interface MatchPreviewCardProps {
  match: MatchFound
}

/**
 * Tarjeta de emparejamiento: tu Tokagotchi, el VS y el del rival.
 *
 * La leyenda de cada lado se arma con las partes que existan. Del rival, el
 * backend solo manda nombre y especie en `FighterStateResponse`, así que su
 * línea es más corta que la nuestra hasta que exponga dueño y rareza — se
 * omite el dato, no se rellena con nada inventado.
 */
export default function MatchPreviewCard({ match }: MatchPreviewCardProps) {
  return (
    <Card padding="md" radius="lg" className={styles.card}>
      <div className={styles.row}>
        <FighterSide fighter={match.me} side="me" />

        <span className={styles.vs} aria-hidden="true">VS</span>

        <FighterSide fighter={match.rival} side="rival" />
      </div>
    </Card>
  )
}

function FighterSide({ fighter, side }: { fighter: MatchFighter; side: 'me' | 'rival' }) {
  const caption = buildCaption(fighter, side)

  return (
    <div className={styles.side}>
      <img className={styles.portrait} src={getSpeciesImageSrc(fighter.species)} alt="" />

      <span className={styles.name}>
        <span className={`${styles.dot} ${side === 'me' ? styles.dotMe : styles.dotRival}`} />
        {fighter.name}
      </span>

      <span className={styles.caption}>{caption}</span>
    </div>
  )
}

/** Leyenda del combatiente, con las partes que el contrato sí trae. */
function buildCaption(fighter: MatchFighter, side: 'me' | 'rival'): string {
  const parts = [
    side === 'me' ? 'Tú' : fighter.username,
    SPECIES_LABEL[fighter.species],
    fighter.rarity ? RARITY_META[fighter.rarity].label : undefined,
  ]

  return parts.filter(Boolean).join(' · ')
}
