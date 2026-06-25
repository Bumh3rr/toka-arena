import { ProgressBar } from '@/shared/ui/Kit'
import type { CollectionData } from '../types/collection.types'
import styles from './DexIndicator.module.css'

interface DexIndicatorProps {
  data: CollectionData
}

export default function DexIndicator({ data }: DexIndicatorProps) {
  const speciesOwned = new Set(data.roster.map(t => t.species)).size
  const pct = Math.round((speciesOwned / data.speciesTotal) * 100)
  const legendaries = data.roster.filter(t => t.rarity === 'LEGENDARY').length

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <span className={styles.label}>Especies</span>
        <b className={styles.count}>{speciesOwned}/{data.speciesTotal}</b>
      </div>
      <ProgressBar pct={pct} />
      <div className={styles.foot}>
        <span className={styles.legendaries}>
          ★ {legendaries} {legendaries !== 1 ? 'Legendarios' : 'Legendario'}
        </span>
        <span className={styles.total}>{data.roster.length} Tokagotchis</span>
      </div>
    </div>
  )
}
