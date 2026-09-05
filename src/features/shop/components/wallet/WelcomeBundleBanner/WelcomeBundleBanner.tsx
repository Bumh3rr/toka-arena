import { Button, Label } from '@/shared/ui/Kit'
import { WELCOME_BUNDLE } from '@/features/shop/lib/walletPacks'
import styles from './WelcomeBundleBanner.module.css'

interface WelcomeBundleBannerProps {
  onClaim: () => void
}

export default function WelcomeBundleBanner({ onClaim }: WelcomeBundleBannerProps) {
  const b = WELCOME_BUNDLE
  return (
    <div className={styles.banner}>
      <Label size="xs" variant="cream" look="solid" className={styles.tag}>
        {b.tag}
      </Label>
      <div className={styles.title}>{b.title}</div>
      <div className={styles.content}>{b.content}</div>
      <div className={styles.sub}>{b.sub}</div>
      <div className={styles.row}>
        <span className={styles.price}>${b.mxn} MXN</span>
        <Button variant="gold" size="md" onClick={onClaim}>
          Reclamar
        </Button>
      </div>
    </div>
  )
}
