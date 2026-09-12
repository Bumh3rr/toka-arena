import styles from './GlyphMedallion.module.css'

interface GlyphMedallionProps {
  /** Signo que ocupa el medallón. Un carácter, no un icono. */
  glyph: string
  /** `calm` para el vacío de rivales, `alert` para el fallo de conexión. */
  tone: 'calm' | 'alert'
  label: string
}

/**
 * Medallón con un signo, en el sitio que ocuparía la moneda.
 *
 * Las dos salidas sin combate (no hay rivales, se cayó la red) necesitan algo
 * en el centro del ruedo: reutilizan la geometría de la moneda para que la
 * pantalla no se sienta hueca ni cambie de composición.
 */
export default function GlyphMedallion({ glyph, tone, label }: GlyphMedallionProps) {
  return (
    <div className={styles.stage}>
      <div
        className={`${styles.medallion} ${tone === 'alert' ? styles.alert : styles.calm}`}
        role="img"
        aria-label={label}
      >
        <span className={styles.glyph} aria-hidden="true">{glyph}</span>
      </div>
    </div>
  )
}
