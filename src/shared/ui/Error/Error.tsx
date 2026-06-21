import styles from './Error.module.css'
import { Card, Button } from '../Kit'

interface PageErrorProps {
  message: string
  onRetry: () => void
}

export default function PageError({ message, onRetry }: PageErrorProps) {
  return (
    <div className={styles.container}>
      <Card variant='warm' shadow='md' className={styles.card}>
        <div className={styles.face} aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none">
            {/* cuerpo redondeado */}
            <rect x="7" y="11" width="50" height="44" rx="19"
              fill="var(--cream-2)" stroke="var(--ink)" strokeWidth="3" />
            {/* ojos confundidos (x · -) */}
            <path d="M19 27 l8 8 M27 27 l-8 8"
              stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
            <path d="M38 31 h9"
              stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
            {/* boca triste */}
            <path d="M24 47 q8 -7 16 0"
              stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className={styles.title}>Algo salió mal</h2>
        <p className={styles.message}>{message}</p>

        <Button variant='danger' onClick={onRetry} fullWidth padding='16px' fontSize={17}>Reintentar</Button>
      </Card>
    </div>
  )
}
