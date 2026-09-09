import Portal from '@/shared/ui/Portal/Portal'
import BottomSheet from '@/shared/ui/Sheet/BottomSheet/BottomSheet'
import { Button, Label } from '@/shared/ui/Kit'
import { formatTF } from '../../../lib/formatTF'
import styles from './PayConfirmSheet.module.css'

interface PayConfirmSheetProps {
  /** Nombre del paquete u oferta. */
  name: string
  /** TF que se acreditan. */
  tf: number
  /** TF extra de bonus (0 si no aplica). */
  bonus: number
  /** Precio en pesos. */
  mxn: number
  /** Lo que incluye además del TF (solo el Welcome Bundle). */
  extras?: string
  /** La orden se está creando: no se puede confirmar dos veces. */
  busy: boolean
  onConfirm: () => void
  onClose: () => void
}

/**
 * Confirmación previa al cobro real.
 *
 * Existe por lo mismo que `BuyConfirmSheet` en las compras con TF, pero aquí el
 * cargo es en pesos: el precio es lo que más pesa en la jerarquía.
 */
export default function PayConfirmSheet({
  name,
  tf,
  bonus,
  mxn,
  extras,
  busy,
  onConfirm,
  onClose,
}: PayConfirmSheetProps) {
  return (
    <Portal>
      <BottomSheet title="Confirmar compra" onClose={onClose}>
        <div className={styles.body}>
          <div className={styles.name}>{name}</div>

          <div className={styles.tf}>
            <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.tfIcon} />
            {formatTF(tf)} TF
          </div>

          {bonus > 0 && (
            <Label size="xs" variant="green" look="soft">
              +{formatTF(bonus)} TF bonus incluidos
            </Label>
          )}

          {extras && <p className={styles.extras}>{extras}</p>}

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.row}>
            <span>Total a pagar</span>
            <span className={styles.price}>${mxn} MXN</span>
          </div>

          <p className={styles.note}>El cobro se hace en la caja de pago de Toka.</p>

          <Button variant="green" size="lg" fullWidth disabled={busy} onClick={onConfirm}>
            {busy ? 'Abriendo pago...' : 'Pagar con Toka'}
          </Button>
          <Button variant="cream" size="md" fullWidth disabled={busy} onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </BottomSheet>
    </Portal>
  )
}
