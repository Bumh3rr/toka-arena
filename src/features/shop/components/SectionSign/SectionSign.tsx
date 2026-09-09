import type { CSSProperties } from 'react'
import styles from './SectionSign.module.css'

export interface SectionIllustration {
  src: string
  /** Ancho relativo al contenedor. Por defecto '78%'. */
  width?: string
  /** Tope en px, para que no crezca de más en pantallas anchas. Por defecto 300. */
  maxWidth?: number
  /** Px que el rótulo monta sobre la ilustración. Por defecto 5. */
  overlap?: number
  /** Src de la tabla */
  plankSrc?: string
}

export interface SectionSignProps {
  /** Título grabado en la madera. */
  title: string
  /**
   * Ilustración que asoma por detrás del rótulo. Omitirla deja el rótulo solo,
   * que es lo que necesitan las secciones sin arte propio todavía.
   */
  illustration?: SectionIllustration
}

/**
 * Rótulo de sección de la tienda.
 *
 * Una tabla de madera con una ilustración asomando por detrás, como si el
 * escaparate estuviera tras el mostrador. Lo comparten todas las secciones a
 * propósito: son hermanas, no jerárquicas, así que la señalización es la
 * constante y lo que las distingue es la ilustración.
 *
 * El título va en HTML y no horneado en la imagen, así que un solo asset sirve
 * para todas las secciones y el texto se puede traducir.
 */
export default function SectionSign({ title, illustration }: SectionSignProps) {
  const PLANK_SRC = illustration?.plankSrc ?? '/assets/ui/tables/table.svg'
  
  const artVars = illustration
    ? ({
        '--art-width': illustration.width ?? '78%',
        '--art-max': `${illustration.maxWidth ?? 300}px`,
        '--art-overlap': `${-(illustration.overlap ?? 5)}px`,
      } as CSSProperties)
    : undefined

  return (
    <header className={styles.sign}>
      {illustration && (
        <img
          src={illustration.src}
          alt=""
          aria-hidden="true"
          className={styles.art}
          style={artVars}
        />
      )}

      <div className={styles.plankWrap}>
        <img src={PLANK_SRC} alt="" aria-hidden="true" className={styles.plank} />
        <h3 className={styles.title}>{title}</h3>
      </div>
    </header>
  )
}
