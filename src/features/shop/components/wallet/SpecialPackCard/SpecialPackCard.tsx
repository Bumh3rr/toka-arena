import { Card, Button, type ColorVariant } from '@/shared/ui/Kit'
import styles from './SpecialPackCard.module.css'
import type { SpecialPack } from '@/features/shop/lib/walletPacks'

const TONE_VARIANT: Record<SpecialPack['tone'], ColorVariant> = {
  legend: 'legend',
  purple: 'purple',
  blue: 'blue',
}

interface SpecialPackCardProps {
  pack: SpecialPack
  onBuy: (pack: SpecialPack) => void
}

export default function SpecialPackCard({ pack, onBuy }: SpecialPackCardProps) {
  return (
    <Card variant="cream" padding="sm" shadow="md" className={styles.card}>
      <div className={styles.name}>{pack.name}</div>
      <div className={styles.desc}>{pack.desc}</div>
      <div className={styles.row}>
        <span className={styles.mxn}>${pack.mxn} MXN</span>
        <Button variant={TONE_VARIANT[pack.tone]} size="sm" onClick={() => onBuy(pack)}>
          Comprar
        </Button>
      </div>
    </Card>
  )
}
