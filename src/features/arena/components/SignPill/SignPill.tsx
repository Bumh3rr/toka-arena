import type { ReactNode } from 'react'
import styles from './SignPill.module.css'

/**
 * `tag` rotula la fase en versalitas, `title` anuncia y `note` narra en voz
 * baja lo que viene a continuación.
 */
type SignPillLook = 'title' | 'tag' | 'note'

interface SignPillProps {
  look?: SignPillLook
  children: ReactNode
}

const LOOK_CLASS: Record<SignPillLook, string> = {
  tag: 'tag',
  title: 'title',
  note: 'note',
}

/**
 * Rótulo colgado sobre el ruedo: la voz que narra en qué punto va el volado.
 *
 * Se reutiliza en las cinco fases del flujo, así que el texto cambia pero la
 * pieza es siempre la misma y no salta de sitio entre pantallas.
 */
export default function SignPill({ look = 'tag', children }: SignPillProps) {
  return (
    <div className={`${styles.pill} ${styles[LOOK_CLASS[look]]}`}>
      {children}
    </div>
  )
}
