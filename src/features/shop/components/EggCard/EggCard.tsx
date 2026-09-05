import type { CSSProperties } from 'react'
import { Card, Button, Label, type ColorVariant } from '@/shared/ui/Kit'
import { RARITY_META } from '@/shared/constants/rarity'
import type { Rarity } from '@/shared/domain/tokagotchi'
import type { StoreItemDTO } from '../../api/dto/shop.dto'
import { formatTF } from '../../lib/formatTF'
import styles from './EggCard.module.css'

const EGG_IMG = '/assets/ui/egg/egg.png'

/** Color del sistema para la cinta de rareza. */
const RARITY_VARIANT: Record<Rarity, ColorVariant> = {
  COMMON: 'cream',
  RARE: 'blue',
  EPIC: 'purple',
  LEGENDARY: 'legend',
}

interface EggCardProps {
  item: StoreItemDTO
  onBuy: (item: StoreItemDTO) => void
  enableBuy?: boolean
}

export default function EggCard({ item, onBuy, enableBuy = true }: EggCardProps) {
  const rarity = (item.eggRarity ?? 'COMMON') as Rarity
  const meta = RARITY_META[rarity]

  return (
    <Card
      variant="cream"
      padding="sm"
      shadow="md"
      className={styles.card}
      style={{ '--egg-glow': meta.soft, '--egg-ring': meta.ring } as CSSProperties}
    >
      <div className={styles.art}>
        <span className={styles.glow} aria-hidden="true" />
        <img src={EGG_IMG} alt="" aria-hidden="true" className={styles.egg} />
      </div>

      <Label variant={RARITY_VARIANT[rarity]} look="solid" size="xs" className={styles.ribbon}>
        {meta.label}
      </Label>

      <div className={styles.name}>{item.displayName}</div>
      <div className={styles.sub}>Adopta un Tokagotchi</div>

      <div className={styles.price}>
        <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.tfIcon} />
        {formatTF(item.priceInTokaFeed)} TF
      </div>

      <Button variant="green" size="sm" fullWidth onClick={() => onBuy(item)} disabled={!enableBuy}>
        Comprar
      </Button>
    </Card>
  )
}
