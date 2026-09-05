import { Card, Button } from '@/shared/ui/Kit'
import { IcImage} from '@/shared/ui/Icons/Icons'
import type { StoreItemDTO } from '../../api/dto/shop.dto'
import { formatTF } from '../../lib/formatTF'
import styles from './SpecialCard.module.css'

interface SpecialCardProps {
  item: StoreItemDTO
  onBuy: (item: StoreItemDTO) => void
  enableBuy?: boolean
}

export default function SpecialCard({ item, onBuy, enableBuy = true }: SpecialCardProps) {
  const isShield = item.itemType === 'EVOLUTION_SHIELD'

  return (
    <Card variant="cream" padding="sm" shadow="md" className={styles.card}>
      <div className={styles.top}>
        <span className={`${styles.medallion} ${isShield ? styles.toneShield : styles.toneBooster}`} aria-hidden="true">
          {isShield ? <IcImage /> : <IcImage />}
        </span>
        <div className={styles.info}>
          <div className={styles.name}>{item.displayName}</div>
          <div className={styles.desc}>{item.description}</div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.price}>
          <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.tfIcon} />
          {formatTF(item.priceInTokaFeed)} TF
        </div>
        <Button variant="green" size="sm" onClick={() => onBuy(item)} disabled={!enableBuy}>
          Comprar
        </Button>
      </div>
    </Card>
  )
}
