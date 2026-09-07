import Portal from '@/shared/ui/Portal/Portal'
import BottomSheet from '@/shared/ui/Sheet/BottomSheet/BottomSheet'
import { Button } from '@/shared/ui/Kit'
import { IcCheck, IcClock, IcX } from '@/shared/ui/Icons/Icons'
import { formatTF } from '../../../lib/formatTF'
import type { PurchasePhase } from '../../../hooks/useTokaPayPurchase'
import styles from './PayStatusSheet.module.css'

interface PayStatusSheetProps {
  phase: PurchasePhase
  onRetry: () => void
  onRefresh: () => void
  onClose: () => void
}

/**
 * Estado del pago mientras el backend lo confirma y una vez resuelto.
 *
 * El texto nunca promete lo que no sabe: hasta que `GET /purchases/{id}` diga
 * SUCCESS, lo único cierto es que se está confirmando.
 */
export default function PayStatusSheet({ phase, onRetry, onRefresh, onClose }: PayStatusSheetProps) {
  if (phase.status === 'idle' || phase.status === 'confirm' || phase.status === 'creating') {
    return null
  }

  const waiting = phase.status === 'cashier' || phase.status === 'confirming'

  return (
    <Portal>
      <BottomSheet title="Pago con Toka" onClose={onClose}>
        <div className={styles.body} role="status" aria-live="polite">
          {waiting && (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <div className={styles.title}>
                {phase.status === 'cashier' ? 'Abriendo la caja de pago' : 'Confirmando tu pago'}
              </div>
              <p className={styles.text}>
                Estamos verificando el cobro con Toka. No cierres la app.
              </p>
              <Button variant="cream" size="md" fullWidth onClick={onClose}>
                Seguir en segundo plano
              </Button>
            </>
          )}

          {phase.status === 'success' && (
            <>
              <span className={`${styles.badge} ${styles.badgeOk}`} aria-hidden="true">
                <IcCheck />
              </span>
              <div className={styles.title}>¡Listo!</div>
              <p className={styles.text}>Se acreditaron {formatTF(phase.tfCredited)} TF a tu cuenta.</p>
              <Button variant="green" size="lg" fullWidth onClick={onClose}>
                Continuar
              </Button>
            </>
          )}

          {phase.status === 'failed' && (
            <>
              <span className={`${styles.badge} ${styles.badgeBad}`} aria-hidden="true">
                <IcX />
              </span>
              <div className={styles.title}>No se completó</div>
              <p className={styles.text}>{phase.message}</p>
              <Button variant="legend" size="lg" fullWidth onClick={onRetry}>
                Reintentar
              </Button>
              <Button variant="cream" size="md" fullWidth onClick={onClose}>
                Cerrar
              </Button>
            </>
          )}

          {phase.status === 'expired' && (
            <>
              <span className={`${styles.badge} ${styles.badgeWait}`} aria-hidden="true">
                <IcClock />
              </span>
              <div className={styles.title}>La orden expiró</div>
              <p className={styles.text}>
                Pasó el tiempo para pagarla y se cerró. Puedes crear una nueva.
              </p>
              <Button variant="legend" size="lg" fullWidth onClick={onRetry}>
                Crear otra orden
              </Button>
              <Button variant="cream" size="md" fullWidth onClick={onClose}>
                Cerrar
              </Button>
            </>
          )}

          {phase.status === 'pending' && (
            <>
              <span className={`${styles.badge} ${styles.badgeWait}`} aria-hidden="true">
                <IcClock />
              </span>
              <div className={styles.title}>Seguimos confirmando</div>
              <p className={styles.text}>
                Toka aún no nos da el resultado. Si el cobro se completó, tu saldo se
                actualizará solo en unos minutos.
              </p>
              <Button variant="legend" size="lg" fullWidth onClick={onRefresh}>
                Actualizar
              </Button>
              <Button variant="cream" size="md" fullWidth onClick={onClose}>
                Cerrar
              </Button>
            </>
          )}
        </div>
      </BottomSheet>
    </Portal>
  )
}
