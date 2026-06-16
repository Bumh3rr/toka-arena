import WoodButton from '@/shared/ui/WoodButton/WoodButton'
import styles from './HomeError.module.css'

interface HomeErrorProps {
  message: string
  onRetry: () => void
}

/**
 * Estado de error del Home: amable y centrado (no un dump). Tokagotchi
 * confundido + mensaje + botón Reintentar. Mismo lenguaje visual del proyecto.
 */
export default function HomeError({ message, onRetry }: HomeErrorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
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

        <WoodButton label="Reintentar" onClick={onRetry} width="220px" />
      </div>
    </div>
  )
}
