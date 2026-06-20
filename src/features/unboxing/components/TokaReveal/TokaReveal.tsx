import type { CSSProperties } from 'react'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import RarityCard from '@/shared/ui/RarityCard/RarityCard'
import { IconButton } from '@/shared/ui/Kit'
import { IcPencil } from '@/shared/ui/Icons/Icons'
import { RARITY_META } from '@/shared/constants/rarity'
import type { Species } from '@/shared/domain/tokagotchi'
import styles from './TokaReveal.module.css'
import type { MainTokagotchi } from '@/shared/domain/player'

const SPECIES_LABEL: Record<Species, string> = {
  TOFU: 'Tofu',
  MOCHI: 'Mochi',
  HANA: 'Hana',
}

// Stats que mostramos en el reveal, con su color identificativo.
const STAT_FIELDS = [
  { key: 'hp', label: 'HP', color: '#46A8DC' },
  { key: 'atk', label: 'ATK', color: '#F08A4B' },
  { key: 'def', label: 'DEF', color: '#6FC04A' },
] as const

interface TokaRevealProps {
  result: MainTokagotchi
  onRenameClick: () => void
}

export default function TokaReveal({ result, onRenameClick }: TokaRevealProps) {
  const meta = RARITY_META[result.rarity]
  const stats = result.stats ?? { hp: 0, atk: 0, def: 0 }
  const nextRarity = result.evolution?.nextRarity ?? null

  return (
    <div
      className={styles.card}
      style={{ '--glow': meta.ring, '--glow-soft': meta.soft } as CSSProperties}
    >
      <div className={styles.hero}>
        <div className={styles.glow} aria-hidden="true" />
        <TokagotchiCanvas width={200} height={200} species={result.species} animacionActual="idle" />
      </div>

      <div className={styles.nameRow}>
        <span className={styles.name}>{result.name}</span>
        <IconButton shape="sm" size={28} variant="cream" onClick={onRenameClick} ariaLabel="Renombrar">
          <IcPencil />
        </IconButton>
      </div>

      <div className={styles.idRow}>
        <RarityCard rarity={result.rarity} size="sm" />
        <span className={styles.species}>{SPECIES_LABEL[result.species]}</span>
      </div>

      <div className={styles.cp}>
        <span className={styles.cpValue}>{result.cp}</span> CP
      </div>

      <div className={styles.stats}>
        {STAT_FIELDS.map((s) => (
          <div key={s.key} className={styles.statBox} style={{ '--sc': s.color } as CSSProperties}>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statValue}>{stats[s.key]}</span>
          </div>
        ))}
      </div>

      {nextRarity && (
        <p className={styles.evo}>
          Puede evolucionar a{' '}
          <b style={{ color: RARITY_META[nextRarity].ring }}>{RARITY_META[nextRarity].label}</b>
        </p>
      )}
    </div>
  )
}
