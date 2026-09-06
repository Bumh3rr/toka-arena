import styles from './AccessoriesHeader.module.css'

/** Trío de tokagotchis luciendo accesorios combinados. */
const CREW_SRC = '/assets/tokagotchis/trio/trio_tokagotchis_front.svg'
/** Rótulo de madera, sin texto: el título se monta encima. */
const SIGN_SRC = '/assets/ui/tables/table.svg'

/**
 * Cabecera de la sección de accesorios.
 *
 * Un rótulo de madera con el trío asomando por detrás, como si atendieran el
 * mostrador. El texto va en HTML y no horneado en la imagen, así que el mismo
 * rótulo sirve para cualquier sección y se puede traducir.
 */
export default function AccessoriesHeader() {
  return (
    <header className={styles.header}>
      <img src={CREW_SRC} alt="" aria-hidden="true" className={styles.crew} />

      <div className={styles.sign}>
        <img src={SIGN_SRC} alt="" aria-hidden="true" className={styles.plank} />
        <h3 className={styles.title}>Accesorios</h3>
      </div>
    </header>
  )
}
