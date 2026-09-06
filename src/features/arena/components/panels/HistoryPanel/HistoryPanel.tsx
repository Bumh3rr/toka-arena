import { Card, Label } from '@/shared/ui/Kit'
import Loading from '@/shared/ui/Loading/Loading'
import PageError from '@/shared/ui/Error/Error'
import { HISTORY_SIZE, useBattleHistory } from '../../../hooks/useBattleHistory'
import styles from './HistoryPanel.module.css'

/** Cómo se nombra y se colorea cada desenlace. */
const RESULT_META = {
  WIN: { label: 'Victoria', variant: 'green' },
  LOSS: { label: 'Derrota', variant: 'danger' },
  DRAW: { label: 'Empate', variant: 'cream' },
} as const

/**
 * Combates anteriores del jugador.
 *
 * El resumen dice "de los últimos N" y no "récord" a propósito: el backend no
 * publica un acumulado, así que las cuentas salen de la página que se trae. Dar
 * a entender que es el histórico completo sería inventar un dato.
 */
export default function HistoryPanel() {
  const { state, reload } = useBattleHistory()

  if (state.status === 'loading') return <Loading text="Abriendo el registro..." />
  if (state.status === 'error') return <PageError message={state.error} onRetry={reload} />

  const { battles, wins, losses } = state

  return (
    <div className={styles.panel}>
      <header className={styles.head}>
        <h2 className={styles.title}>Historial</h2>
        {battles.length > 0 && (
          <span className={styles.tally}>
            <Label variant="green" look="soft" size="xs">{wins} G</Label>
            <Label variant="danger" look="soft" size="xs">{losses} P</Label>
          </span>
        )}
      </header>

      {battles.length === 0 ? (
        <Card padding="md" radius="lg" className={styles.empty}>
          Todavía no has peleado. Tu primer combate aparecerá aquí.
        </Card>
      ) : (
        <>
          <p className={styles.lead}>De tus últimos {HISTORY_SIZE} combates</p>

          <div className={styles.list}>
            {battles.map((battle) => {
              const meta = RESULT_META[battle.result]

              return (
                <Card key={battle.battleId} padding="sm" radius="lg" className={styles.row}>
                  <span className={`${styles.mark} ${styles[battle.result.toLowerCase()]}`} />

                  <div className={styles.info}>
                    <span className={styles.rival}>{battle.opponentTokagotchiName}</span>
                    <span className={styles.meta}>
                      {battle.opponentName} · {battle.totalTurns} turnos
                    </span>
                  </div>

                  <Label variant={meta.variant} look="soft" size="xs">
                    {meta.label}
                  </Label>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
