import type { ReactNode } from 'react'
import { Card, Label } from '@/shared/ui/Kit'
import styles from './PanelPlaceholder.module.css'

interface PanelPlaceholderProps {
  title: string
  /** Qué vivirá aquí, para que el hueco se lea intencional y no roto. */
  description: string
  icon: ReactNode
}

/**
 * Panel cuyo contenido todavía no está construido.
 *
 * Se usa en Pociones e Historial: la entrada ya existe en el lobby y el hueco
 * anuncia lo que llegará, en lugar de abrir un cajón vacío.
 */
export default function PanelPlaceholder({ title, description, icon }: PanelPlaceholderProps) {
  return (
    <div className={styles.panel}>
      <header className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <Label variant="cream" look="soft" size="xs" uppercase>Próximamente</Label>
      </header>

      <Card variant="cream" padding="lg" radius="lg" className={styles.body}>
        <span className={styles.icon}>{icon}</span>
        <p className={styles.description}>{description}</p>
      </Card>
    </div>
  )
}
