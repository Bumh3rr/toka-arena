import type { CSSProperties } from 'react'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import { RARITY_META } from '@/shared/constants/rarity'
import type { CollectionData } from '../types/collection.types'
import { getActiveTokaView } from '../lib/equipped'
import styles from './EquippedPreview.module.css'

interface EquippedPreviewProps {
  data: CollectionData
}

/**
 * Muestra al Tokagotchi activo con sus accesorios puestos encima (vía canvas),
 * para que el usuario vea de un vistazo qué tiene equipado. Solo lectura.
 */
export default function EquippedPreview({ data }: EquippedPreviewProps) {
  const { toka, equipped, headName, bodyName } = getActiveTokaView(data)
  if (!toka) return null

  const meta = RARITY_META[toka.rarity]

  return (
    <section className={styles.card} aria-label={`Tokagotchi activo: ${toka.nick}`}>
      <div className={styles.canvasWrap} style={{ '--glow-soft': meta.soft } as CSSProperties}>
        <TokagotchiCanvas
          species={toka.species}
          accessories={equipped}
          animacionActual="idle"
          width={140}
          height={140}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.head}>
          <span className={styles.name}>{toka.nick}</span>
          <span className={styles.rar} style={{ background: meta.ring }}>{meta.label}</span>
        </div>
        <p className={styles.subtitle}>Equipado</p>
        <SlotRow label="Cabeza" name={headName} />
        <SlotRow label="Cuerpo" name={bodyName} />
      </div>
    </section>
  )
}

function SlotRow({ label, name }: { label: string; name: string | null }) {
  return (
    <div className={styles.slotRow}>
      <span className={`${styles.dot} ${name ? styles.dotOn : ''}`} aria-hidden="true" />
      <span className={styles.slotLabel}>{label}</span>
      <span className={`${styles.slotName} ${name ? '' : styles.slotEmpty}`}>{name ?? 'Vacío'}</span>
    </div>
  )
}
