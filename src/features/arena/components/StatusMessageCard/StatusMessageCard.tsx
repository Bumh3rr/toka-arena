import type { ReactNode } from 'react'
import { Card } from '@/shared/ui/Kit'
import styles from './StatusMessageCard.module.css'

interface StatusMessageCardProps {
  title: string
  description?: string
  /** Botones de la fase. Van dentro de la tarjeta para leerse como una unidad. */
  children?: ReactNode
}

/**
 * Tarjeta de estado bajo el ruedo: qué pasó y, si toca decidir algo, con qué
 * botones. La usan las cinco fases que hablan, así que el bloque de texto
 * mantiene la misma posición y ritmo en todas.
 */
export default function StatusMessageCard({
  title,
  description,
  children,
}: StatusMessageCardProps) {
  return (
    <div className={styles.wrap}>
      <Card padding="md" radius="lg" className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </Card>

      {children && <div className={styles.actions}>{children}</div>}
    </div>
  )
}
