import type { CollectionData, AccSlotFilter, AccSlotKey } from '../types/collection.types'
import { ProgressBar } from '@/shared/ui/Kit'
import AccCard from './AccCard'
import LockedCard from './LockedCard'
import EquippedPreview from './EquippedPreview'
import styles from './AccGrid.module.css'

interface AccGridProps {
  data: CollectionData
  slotFilter: AccSlotFilter
  onSetSlot: (slot: AccSlotFilter) => void
}

const SLOT_CHIPS: { key: AccSlotFilter; label: string; future?: boolean }[] = [
  { key: 'todos',   label: 'Todos' },
  { key: 'cabeza',  label: 'Cabeza' },
  { key: 'cuerpo',  label: 'Cuerpo' },
  { key: 'cara',    label: 'Cara 🔒',    future: true },
  { key: 'espalda', label: 'Espalda 🔒', future: true },
]

export default function AccGrid({ data, slotFilter, onSetSlot }: AccGridProps) {
  const owned = data.accessories.filter(a => !a.locked).length
  const total = data.accessories.length
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0

  const visible = slotFilter === 'todos'
    ? data.accessories
    : data.accessories.filter(a => a.slot === (slotFilter as AccSlotKey))

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
        {visible.map(a =>
          a.locked
            ? <LockedCard key={a.id} />
            : <AccCard key={a.id} acc={a} />
        )}
      </div>

      <p className={styles.legend}>×N = cantidad &nbsp; 🐾 En N = equipado &nbsp; 🔒 Falta</p>
    </div>
  )
}
