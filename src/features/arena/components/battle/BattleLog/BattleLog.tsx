import { Card } from '@/shared/ui/Kit'
import styles from './BattleLog.module.css'

interface BattleLogProps {
  /** Últimas líneas, la más reciente al final. */
  lines: string[]
}

/**
 * Relato del combate.
 *
 * El texto viene **redactado por el servidor** (`lastActionDescription`) y se
 * muestra tal cual. Reformatearlo obligaría a parsear la frase para sacarle el
 * número y el nombre de la habilidad, y eso se rompe con cada retoque del copy
 * del backend.
 *
 * Nota: hoy el servidor escribe la habilidad en inglés ("usó ROAR") porque
 * `SkillType` no tiene nombre en español, al contrario que `PotionType`.
 * Cuando el backend lo añada, esta vista pasa a español sin tocar nada.
 */
export default function BattleLog({ lines }: BattleLogProps) {
  return (
    <Card padding="sm" radius="lg" className={styles.card}>
      {lines.length === 0 ? (
        <p className={styles.line}>El combate va a comenzar...</p>
      ) : (
        lines.map((line, i) => (
          <p
            key={`${i}-${line}`}
            className={`${styles.line} ${i === lines.length - 1 ? styles.latest : ''}`}
          >
            {line}
          </p>
        ))
      )}
    </Card>
  )
}
