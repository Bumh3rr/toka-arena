import { Button, Label } from '@/shared/ui/Kit'
import { REST_ENERGY } from '../../../constants/battle'
import styles from './BattleActionBar.module.css'

interface BattleActionBarProps {
  /** Pociones que le quedan al jugador en este combate. */
  potionsLeft: number
  enabled: boolean
  onOpenPotions: () => void
  onRest: () => void
}

/**
 * Las dos acciones que no son habilidades: beber y descansar.
 *
 * Descansar destaca porque es la salida cuando no alcanza la energía, que es
 * justo el momento en que el jugador se queda sin saber qué hacer.
 */
export default function BattleActionBar({
  potionsLeft,
  enabled,
  onOpenPotions,
  onRest,
}: BattleActionBarProps) {
  const hasPotions = potionsLeft > 0

  return (
    <div className={styles.bar}>
      <button
        type="button"
        className={`${styles.potions} ${enabled && hasPotions ? '' : styles.off}`}
        disabled={!enabled || !hasPotions}
        onClick={onOpenPotions}
      >
        <img className={styles.flask} src="/assets/arena/potions/lesser_healing_potion.svg" alt="" />
        <span className={styles.label}>Pociones</span>
        <Label variant={hasPotions ? 'cream' : 'danger'} look="soft" size="xs">
          {potionsLeft}
        </Label>
      </button>

      <Button
        variant="blue"
        size="lg"
        radius="lg"
        fullWidth
        disabled={!enabled}
        onClick={onRest}
        className={styles.rest}
      >
        <span className={styles.restInner}>
          Descansar
          <Label variant="cream" look="soft" size="xs">
            +{REST_ENERGY} NRG
          </Label>
        </span>
      </Button>
    </div>
  )
}
