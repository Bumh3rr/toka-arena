import { Card } from '@/shared/ui/Kit'
import styles from './CardCP.module.css'

interface CardCPProps {
    value: number
}

function CardCP({ value }: CardCPProps) {
  return (
    <Card variant='gold' className={styles.cardCp}>
      <img src="/assets/ui/cp/cp_stars.png" alt="CP" className={styles.cpIcon} />
      <span className={styles.cpNum}>{value} <span className={styles.cpLabel}>cp</span></span>
    </Card>
  )
}

export default CardCP