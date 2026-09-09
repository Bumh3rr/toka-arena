import Portal from '@/shared/ui/Portal/Portal'
import BottomSheet from '@/shared/ui/Sheet/BottomSheet/BottomSheet'
import { Button } from '@/shared/ui/Kit'
import { IcCheck, IcClock, IcX } from '@/shared/ui/Icons/Icons'
import { formatTF } from '../../../lib/formatTF'
import type { PaymentStep } from '../../../hooks/useWalletPayment'
import styles from './PayStatusSheet.module.css'

interface PayStatusSheetProps {
  /** Paso actual del pago. En `idle`, `confirm` y `paying` no se muestra nada. */
  step: PaymentStep
  /** TF que se acreditan, para el mensaje de éxito. */
  tf: number
  /** Motivo del fallo, cuando `step` es `error`. */
  error: string
  onRetry: () => void
  onCheck: () => void
  onClose: () => void
}

/**
 * Estado del pago mientras el backend lo confirma y una vez resuelto.
 *
 * El texto nunca promete lo que no sabe: hasta que el backend diga SUCCESS, lo
 * único cierto es que se está confirmando.
 */
export default function PayStatusSheet({ step, tf, error, onRetry, onCheck, onClose }: PayStatusSheetProps) {
  if (step === 'idle' || step === 'confirm' || step === 'paying') return null

  return (
    <Portal>
      <BottomSheet title="Pago con Toka" onClose={onClose}>
        <div className={styles.body} role="status" aria-live="polite">
          {step === 'checking' && (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <div className={styles.title}>Confirmando tu pago</div>
              <p className={styles.text}>
                Estamos verificando el cobro con Toka. No cierres la app.
              </p>
              <Button variant="cream" size="md" fullWidth onClick={onClose}>
                Seguir en segundo plano
              </Button>
            </>
          )}

          {step === 'done' && (
            <>
              <span className={`${styles.badge} ${styles.badgeOk}`} aria-hidden="true">
                <IcCheck />
              </span>
              <div className={styles.title}>¡Listo!</div>
              <p className={styles.text}>Se acreditaron {formatTF(tf)} TF a tu cuenta.</p>
              <Button variant="green" size="lg" fullWidth onClick={onClose}>
                Continuar
              </Button>
            </>
          )}

          {step === 'error' && (
            <>
              <span className={`${styles.badge} ${styles.badgeBad}`} aria-hidden="true">
                <IcX />
              </span>
              <div className={styles.title}>No se completó</div>
              <p className={styles.text}>{error}</p>
              <Button variant="legend" size="lg" fullWidth onClick={onRetry}>
                Reintentar
              </Button>
              <Button variant="cream" size="md" fullWidth onClick={onClose}>
                Cerrar
              </Button>
            </>
          )}

          {step === 'pending' && (
            <>
              <span className={`${styles.badge} ${styles.badgeWait}`} aria-hidden="true">
                <IcClock />
              </span>
              <div className={styles.title}>Seguimos confirmando</div>
              <p className={styles.text}>
                Toka aún no nos da el resultado. Si el cobro se completó, tu saldo se
                actualizará solo en unos minutos.
              </p>
              <Button variant="legend" size="lg" fullWidth onClick={onCheck}>
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
