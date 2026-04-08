import TokagotchiCanvas from '../../../components/TofuCanvas/TofuCanvas'
import styles from './Arena.module.css'
import resultStyles from './ResultadoView.module.css'

export default function VictoriaView({ batalla }: { batalla: any }) {
  const { tokagotchi, estadoBatalla, modo, volverLobby } = batalla

  return (
    <div className={styles.view} style={{ alignItems: 'center' }}>
      <div className={resultStyles.banner} style={{
        background: 'rgba(67, 160, 71, 0.2)',
        borderColor: '#43A047'
      }}>
        <span className={resultStyles.bannerText} style={{ color: '#81C784' }}>
          ¡Victoria!
        </span>
      </div>

      <TokagotchiCanvas
        tokagotchi={tokagotchi}
        animacion="win"
        width={200}
        height={200}
        scale={0.4}
      />

      <div className={resultStyles.recompensaCard}>
        <span className={resultStyles.recompensaLabel}>Recompensa</span>
        <span className={resultStyles.recompensaValor} style={{ color: '#F5DFA0' }}>
          +2 TF
        </span>
      </div>

      <div className={styles.card} style={{ width: '100%', marginTop: 8 }}>
        <span className={styles.sectionLabel}>Resumen</span>
        <div className={resultStyles.resumenGrid}>
          <div className={resultStyles.resumenItem}>
            <span className={resultStyles.resumenLabel}>Turnos</span>
            <span className={resultStyles.resumenValor}>{estadoBatalla.turno}</span>
          </div>
          <div className={resultStyles.resumenItem}>
            <span className={resultStyles.resumenLabel}>HP final</span>
            <span className={resultStyles.resumenValor} style={{ color: '#43A047' }}>
              {estadoBatalla.hpJugador}
            </span>
          </div>
          <div className={resultStyles.resumenItem}>
            <span className={resultStyles.resumenLabel}>Modo</span>
            <span className={resultStyles.resumenValor} style={{ textTransform: 'capitalize' }}>
              {modo}
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', paddingBottom: 16 }}>
        <button className={styles.btnPrimary} onClick={volverLobby}>
          Volver al lobby
        </button>
        <button className={styles.btnSecondary} onClick={volverLobby}>
          Revancha
        </button>
      </div>
    </div>
  )
}