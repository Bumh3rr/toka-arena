import styles from './HomeSkeleton.module.css'

/**
 * Placeholder de carga del Home. Refleja el layout real (canvas del Tokagotchi,
 * pastilla de estado, fila de cuidado, pase de batalla) con un shimmer sutil,
 * para que se sienta la misma app y no un spinner genérico.
 */
export default function HomeSkeleton() {
  return (
    <div className={styles.container} aria-busy="true" aria-label="Cargando inicio">
      <div className={styles.bg} />

      {/* TopBar: avatar + nombre + TF */}
      <div className={styles.topbar}>
        <div className={styles.user}>
          <div className={`${styles.sk} ${styles.avatar}`} />
          <div className={`${styles.sk} ${styles.name}`} />
        </div>
        <div className={`${styles.sk} ${styles.coin}`} />
      </div>

      {/* Pase de batalla (pestaña lateral) */}
      <div className={`${styles.sk} ${styles.pass}`} />

      {/* Tokagotchi */}
      <div className={`${styles.sk} ${styles.toka}`} />

      {/* Controles flotantes: pastilla de estado + 3 botones de cuidado */}
      <div className={styles.controls}>
        <div className={`${styles.sk} ${styles.pill}`} />
        <div className={styles.care}>
          <div className={`${styles.sk} ${styles.careBtn}`} />
          <div className={`${styles.sk} ${styles.careBtn}`} />
          <div className={`${styles.sk} ${styles.careBtn}`} />
        </div>
      </div>
    </div>
  )
}
