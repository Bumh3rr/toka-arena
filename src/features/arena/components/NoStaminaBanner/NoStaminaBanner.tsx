import { Button, Card } from '@/shared/ui/Kit'
import { useCountdown } from '../../hooks/useCountdown'
import { formatCountdown } from '../../lib/time'
import type { Stamina } from '../../types/arena.types'
import styles from './NoStaminaBanner.module.css'

interface NoStaminaBannerProps {
  stamina: Stamina
  onRefill: () => void
}

/**
 * Aviso que sustituye a las acciones normales cuando la estamina llega a cero.
 * Ofrece las dos salidas: esperar la recarga o pagarla con TF.
 */
export default function NoStaminaBanner({ stamina, onRefill }: NoStaminaBannerProps) {
  const remaining = useCountdown(stamina.nextRefillAt)

  return (
    <Card padding="none" radius="lg" className={styles.banner}>
      <div className={styles.info}>
        <span className={styles.title}>Sin estamina</span>
        <span className={styles.hint}>
          Vuelve en {formatCountdown(remaining)} o recarga las {stamina.max}
        </span>
      </div>

      <Button
        variant="gold"
        size="md"
        radius="lg"
        onClick={onRefill}
        icon={<img src="/assets/ui/tf/tf.svg" alt="" className={styles.coin} />}
      >
        {stamina.fullRefillCostTF} TF
      </Button>
    </Card>
  )
}
