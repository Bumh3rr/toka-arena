// src/features/collection/components/AbilityRow.tsx
import type { ColAbility } from '../types/collection.types'
import styles from './AbilityRow.module.css'

interface AbilityRowProps {
  ability: ColAbility
  idx: number
  expanded: boolean
  onToggle: (idx: number) => void
}

export default function AbilityRow({ ability, idx, expanded, onToggle }: AbilityRowProps) {
  return (
    <button
      className={`${styles.row} ${ability.signature ? styles.sig : ''}`}
      onClick={() => onToggle(idx)}
      aria-expanded={expanded}
    >
      <div className={styles.top}>
        <span className={styles.name}>{ability.name}</span>
        {ability.signature && <span className={styles.sigBadge}>Signature</span>}
        <span className={styles.nrg}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13 2L5 14h5l-1 8 8-12h-5l1-8z" fill="currentColor"/>
          </svg>
          {ability.nrg}
        </span>
      </div>
      {expanded && <p className={styles.desc}>{ability.desc}</p>}
    </button>
  )
}
