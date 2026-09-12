import { Card, IconButton } from '@/shared/ui/Kit'
import { IcClock } from '@/shared/ui/Icons/Icons'
import { useBattleHistory } from '../../hooks/useBattleHistory'
import styles from './RecordCard.module.css'

interface RecordCardProps {
  onOpenHistory: () => void
}

/**
 * Píldora de historial anclada al borde derecho del lobby.
 *
 * Las cuentas salen de los últimos combates, que es lo único que el backend
 * ofrece: no hay endpoint de marcador acumulado. Mientras cargan se enseñan
 * guiones en lugar de ceros, que se leerían como "nunca has ganado".
 */
export default function RecordCard({ onOpenHistory }: RecordCardProps) {
  const { state } = useBattleHistory()

  const wins = state.status === 'ready' ? String(state.wins) : '—'
  const losses = state.status === 'ready' ? String(state.losses) : '—'

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
