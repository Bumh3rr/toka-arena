import type { CollectionData, AccSlotFilter } from '../types/collection.types'
import { ProgressBar } from '@/shared/ui/Kit'
import AccCard from './AccCard'
import LockedCard from './LockedCard'
import EquippedPreview from './EquippedPreview'
import styles from './AccGrid.module.css'
import { SLOT_CHIPS } from '../hooks/accessories/useCollectionAccessoriesData'

interface AccGridProps {
  data: CollectionData
  slotFilter: AccSlotFilter
  onSetSlot: (slot: AccSlotFilter) => void
  owned: number
  total: number
  pct: number
  visibleAccessories: CollectionData['accessories']
}

export default function AccGrid({
  data,
  slotFilter,
  onSetSlot,
  owned,
  total,
  pct,
  visibleAccessories,
}: AccGridProps) {

  return (
    <div className={styles.tab}>
      <EquippedPreview data={data} />

      <div className={styles.dex}>
        <div className={styles.dexRow}>
          <span className={styles.dexLabel}>Catálogo de accesorios</span>
          <b className={styles.dexCount}>{owned}/{total}</b>
        </div>
        <ProgressBar pct={pct} />
      </div>

      <div className={styles.chips} role="group" aria-label="Filtro por slot">
        {SLOT_CHIPS.map(c => (
          <button
            key={c.key}
            disabled={c.future}
            className={`${styles.chip} ${slotFilter === c.key ? styles.on : ''} ${c.future ? styles.future : ''}`}
            onClick={() => !c.future && onSetSlot(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={styles.grid} role="list">
        {visibleAccessories.map(a =>
          a.locked
            ? <LockedCard key={a.id} />
            : <AccCard key={a.id} acc={a} />
        )}
      </div>

      <p className={styles.legend}>×N = cantidad &nbsp; 🐾 En N = equipado &nbsp; 🔒 Falta</p>
    </div>
  )
}
