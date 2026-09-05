import { Button, Label } from '@/shared/ui/Kit'
import type { TfPack } from '../../../lib/walletPacks'
import { formatTF } from '../../../lib/formatTF'
import styles from './TfPackCard.module.css'

interface TfPackCardProps {
  pack: TfPack
  onBuy: (pack: TfPack) => void
}

export default function TfPackCard({ pack, onBuy }: TfPackCardProps) {
  
  let srcTf = "tf.svg" 
  if (pack.tf > 50 && pack.tf <= 1000) {
    srcTf = "stack_tf.svg"
  } else if (pack.tf > 1000 && pack.tf <= 5000) {
    srcTf = "bg_tf.svg"
  } else if (pack.tf > 5000) {
    srcTf = "box_tf.svg"
  }

  return (
    <div className={`${styles.pack} ${pack.popular ? styles.popular : ''}`}>
      {pack.popular && <span className={styles.popBadge}>MÁS POPULAR</span>}

      <div className={styles.info}>
        <div className={styles.name}>{pack.name}</div>
        <div className={styles.tf}>
          <img src={`/assets/ui/tf/${srcTf}`} alt="" aria-hidden="true" className={styles.tfIcon} />
          {formatTF(pack.tf)} TF
        </div>
        {pack.bonus > 0 && (
          <Label size="xs" variant="green" look="soft" className={styles.bonus}>
            +{formatTF(pack.bonus)} TF bonus
          </Label>
        )}
      </div>

      <div className={styles.buy}>
        <div className={styles.mxn}>${pack.mxn} MXN</div>
        <Button variant="legend" size="sm" onClick={() => onBuy(pack)}>
          Comprar
        </Button>
      </div>
    </div>
  )
}
