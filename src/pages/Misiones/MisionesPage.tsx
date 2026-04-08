import { useMisiones } from '../../hooks/useMisiones'
import styles from './MisionesPage.module.css'

export default function MisionesPage() {
  const { misiones, loading, completadas, total } = useMisiones()

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Misiones del día</h1>
        <div className={styles.tfBadge}>
          <span className={styles.tfAmount}>10 TF</span>
        </div>
      </div>

      {/* Progreso general */}
      <div className={styles.progressHeader}>
        <span className={styles.progressText}>
          {completadas}/{total} completadas
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${total > 0 ? (completadas / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Lista de misiones */}
      <div className={styles.scroll}>
        {loading ? (
          <div className={styles.loading}>
            <span className={styles.loadingText}>Cargando misiones...</span>
          </div>
        ) : (
          misiones.map((mision) => (
            <div
              key={mision.id}
              className={`${styles.misionCard} ${mision.completada ? styles.completada : ''}`}
            >
              <div className={styles.misionLeft}>
                <span className={styles.misionNombre}>{mision.nombre}</span>
                <div className={styles.misionBarWrapper}>
                  <div className={styles.misionBar}>
                    <div
                      className={styles.misionFill}
                      style={{ width: `${mision.progreso}%` }}
                    />
                  </div>
                  <span className={styles.misionProgreso}>
                    {mision.progreso}%
                  </span>
                </div>
              </div>

              <div className={styles.misionRight}>
                {mision.completada ? (
                  <div className={styles.completadaBadge}>
                    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                      <path
                        d="M5 12L10 17L19 7"
                        stroke="#43A047"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <span className={styles.recompensa}>+{mision.recompensa} TF</span>
                )}
              </div>
            </div>
          ))
        )}

        {/* Spacer */}
        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}