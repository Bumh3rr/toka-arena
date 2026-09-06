import { Card, IconButton } from '@/shared/ui/Kit'
import { IcClock } from '@/shared/ui/Icons/Icons'
import type { BattleRecord } from '../../types/arena.types'
import styles from './RecordCard.module.css'

interface RecordCardProps {
  record: BattleRecord
  onOpenHistory: () => void
}

/**
 * Píldora de historial anclada al borde derecho del lobby.
 * El botón del reloj abre el panel de historial.
 */
export default function RecordCard({ record, onOpenHistory }: RecordCardProps) {
  const { wins, losses } = record

  return (
    <Card padding="none" radius="lg" className={styles.card}>
      <div className={styles.info}>
        <span className={styles.title}>Historial</span>
        <span className={styles.score}>
          <b className={styles.wins}>{wins}</b> V
          <span className={styles.dot} aria-hidden="true">·</span>
          <b className={styles.losses}>{losses}</b> D
        </span>
      </div>

      <IconButton
        variant="warm"
        size={38}
        shape="md"
        onClick={onOpenHistory}
        ariaLabel="Ver historial de batallas"
      >
        <IcClock />
      </IconButton>
    </Card>
  )
}
