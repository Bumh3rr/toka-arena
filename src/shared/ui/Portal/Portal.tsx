import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
  /** Nodo destino del portal. Por defecto `document.body`. */
  container?: Element | null
}

/**
 * Renderiza `children` en un portal (por defecto `<body>`), fuera del árbol DOM
 * del componente padre.
 *
 * **Cuándo usarlo:** overlays / sheets / modales full-screen (`position: fixed`)
 * que quedan mal por vivir dentro de un contenedor con scroll (`overflow: auto`)
 * o dentro del stacking context de un ancestro. Dos síntomas típicos:
 * - En iOS WebKit el `fixed` se ancla al contenido scrolleado y se desplaza con
 *   el scroll (no cubre el viewport).
 * - Un ancestro con `z-index` atrapa al elemento y otro hermano (p. ej. el
 *   BottomNav) lo tapa aunque tenga un z-index altísimo.
 *
 * Colgar de `<body>` lo ancla al viewport y por encima de todo. Los contextos de
 * React (SWR, NavBar, Toast, etc.) se preservan a través del portal.
 *
 * @example
 * return <Portal><div className={styles.overlay}>...</div></Portal>
 */
export default function Portal({ children, container }: PortalProps) {
  const target = container ?? (typeof document !== 'undefined' ? document.body : null)
  if (!target) return null
  return createPortal(children, target)
}
