import styles from './Arena.module.css'
import prepStyles from './PreparacionView.module.css'

export default function PreparacionView({ batalla }: { batalla: any }) {
  const {
    consumibles, comprarConsumible, devolverConsumible,
    tfDisponible, totalTFGastado, buscarRival, setFase
  } = batalla

  const tfRestante = tfDisponible - totalTFGastado

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>Preparación</h1>

      {/* TF disponible */}
      <div className={styles.cardDark} style={{ marginBottom: 12 }}>
        <div className={prepStyles.tfRow}>
          <div>
            <div className={styles.sectionLabelLight}>TF disponible</div>
            <span className={prepStyles.tfValue}>{tfRestante} TF</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.sectionLabelLight}>Gastado</div>
            <span className={prepStyles.tfGastado}>{totalTFGastado} TF</span>
          </div>
        </div>
      </div>

      {/* Consumibles */}
      <div className={styles.sectionLabelLight}>Consumibles</div>
      <div className={prepStyles.consumiblesList}>
        {consumibles.map((c: any) => (
          <div key={c.id} className={prepStyles.consumibleCard}>
            <div className={prepStyles.consumibleInfo}>
              <span className={prepStyles.consumibleNombre}>{c.nombre}</span>
              <span className={prepStyles.consumibleEfecto}>{c.efecto}</span>
              <span className={prepStyles.consumiblePrecio}>{c.precio} TF c/u</span>
            </div>
            <div className={prepStyles.consumibleControls}>
              <button
                className={prepStyles.btnMinus}
                onClick={() => devolverConsumible(c.id)}
                disabled={c.cantidad === 0}
              >
                −
              </button>
              <span className={prepStyles.consumibleCantidad}>{c.cantidad}</span>
              <button
                className={prepStyles.btnPlus}
                onClick={() => comprarConsumible(c.id)}
                disabled={tfRestante < c.precio}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      {totalTFGastado > 0 && (
        <div className={styles.card} style={{ marginTop: 8 }}>
          <div className={styles.sectionLabel}>Inventario seleccionado</div>
          {consumibles
            .filter((c: any) => c.cantidad > 0)
            .map((c: any) => (
              <div key={c.id} className={prepStyles.resumenRow}>
                <span className={prepStyles.resumenNombre}>
                  {c.nombre} x{c.cantidad}
                </span>
                <span className={prepStyles.resumenPrecio}>
                  {c.precio * c.cantidad} TF
                </span>
              </div>
            ))}
        </div>
      )}

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
        <button className={styles.btnPrimary} onClick={buscarRival}>
          Buscar rival
        </button>
        <button className={styles.btnSecondary} onClick={() => setFase('lobby')}>
          Volver
        </button>
      </div>
    </div>
  )
}