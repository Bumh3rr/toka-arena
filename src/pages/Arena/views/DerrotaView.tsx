import TokagotchiCanvas from '../../../components/TofuCanvas/TofuCanvas'
import styles from './Arena.module.css'
import resultStyles from './ResultadoView.module.css'

export default function DerrotaView({ batalla }: { batalla: any }) {
  const { tokagotchi, estadoBatalla, modo, volverLobby, resultado } = batalla
  const esApuesta = modo === 'apuesta'

  return (
    <div className={styles.view} style={{ alignItems: 'center' }}>
      <div className={resultStyles.banner} style={{
        background: 'rgba(198, 40, 40, 0.2)',
        borderColor: '#C62828',
        maxWidth: 520
      }}>
        <span className={resultStyles.bannerText} style={{ color: '#EF5350' }}>
          Derrota
        </span>
      </div>

      <TokagotchiCanvas
        tokagotchi={tokagotchi}
        animacion="ko"
        width={200}
        height={200}
        scale={0.35}
      />

      {esApuesta && (
        <div className={resultStyles.apuestaBanner} style={{ maxWidth: 520 }}>
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64 18.3 1.55 18.64 1.55 19C1.55 20.1 2.45 21 3.55 21H20.45C21.55 21 22.45 20.1 22.45 19C22.45 18.64 22.36 18.3 22.18 18L13.71 3.86C13.53 3.56 13.28 3.31 12.98 3.14C12.04 2.61 10.82 2.95 10.29 3.86Z"
              stroke="#FF8000" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className={resultStyles.apuestaText}>
            Tu Tokagotchi fue transferido al ganador permanentemente
          </span>
        </div>
      )}

      <div className={styles.card} style={{ width: '100%', marginTop: 8, maxWidth: 520 }}>
        <span className={styles.sectionLabel}>Resumen</span>
        <div className={resultStyles.resumenGrid}>
          <div className={resultStyles.resumenItem}>
            <span className={resultStyles.resumenLabel}>Turnos</span>
            <span className={resultStyles.resumenValor}>{resultado?.turnos ?? estadoBatalla.turno}</span>
          </div>
          <div className={resultStyles.resumenItem}>
            <span className={resultStyles.resumenLabel}>HP final</span>
            <span className={resultStyles.resumenValor} style={{ color: '#EF5350' }}>
              {resultado?.hpRestante ?? 0}
            </span>
          </div>
          <div className={resultStyles.resumenItem}>
            <span className={resultStyles.resumenLabel}>Modo</span>
            <span className={resultStyles.resumenValor} style={{ textTransform: 'capitalize' }}>
              {resultado?.modo ?? modo}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.card} style={{ width: '100%', marginTop: 8, maxWidth: 520 }}>
        <span className={styles.sectionLabel}>Daño total causado</span>
        <div className={resultStyles.resumenGridSingle}>
          <div className={resultStyles.resumenItem}>
            <span className={resultStyles.resumenLabel}>Infligido</span>
            <span className={resultStyles.resumenValor}>{resultado?.danoTotal ?? 0}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 520, paddingBottom: 16 }}>
        <button className={styles.btnPrimary} onClick={volverLobby}>
          Volver al lobby
        </button>
      </div>
    </div>
  )
}