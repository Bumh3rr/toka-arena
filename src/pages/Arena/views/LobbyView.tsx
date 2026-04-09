import TokagotchiCanvas from '../../../components/TofuCanvas/TofuCanvas'
import styles from './Arena.module.css'
import lobbyStyles from './LobbyView.module.css'

export default function LobbyView({ batalla }: { batalla: any }) {
  const { tokagotchi, modo, setModo, setFase } = batalla

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>Arena</h1>

      {/* Toka activo */}
      <div className={styles.card} style={{ marginBottom: 12 }}>
        <div className={lobbyStyles.tokaRow}>
          <TokagotchiCanvas
            tokagotchi={tokagotchi}
            animacion="idle"
            width={120}
            height={120}
            scale={0.28}
          />
          <div className={lobbyStyles.tokaInfo}>
            <span className={lobbyStyles.tokaName}>{tokagotchi.nombre}</span>
            <span className={lobbyStyles.tokaEspecie}>
              {tokagotchi.especie} · {tokagotchi.rareza}
            </span>
            <div className={lobbyStyles.statsRow}>
              <span className={lobbyStyles.statAtk}>ATK {tokagotchi.stats.atk}</span>
              <span className={lobbyStyles.statDef}>DEF {tokagotchi.stats.def}</span>
              <span className={lobbyStyles.statHp}>HP {tokagotchi.stats.hp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selección de modo */}
      <div className={styles.sectionLabel} style={{ color: '#FFF8E7' }}>
        Selecciona modo
      </div>

      <div
        className={`${lobbyStyles.modoCard} ${modo === 'normal' ? lobbyStyles.modoActivo : ''}`}
        onClick={() => setModo('normal')}
      >
        <div className={lobbyStyles.modoHeader}>
          <div className={lobbyStyles.modoRadio}>
            {modo === 'normal' && <div className={lobbyStyles.modoRadioFill} />}
          </div>
          <span className={lobbyStyles.modoNombre}>Modo Normal</span>
        </div>
        <span className={lobbyStyles.modoDesc}>Sin riesgo de pérdida · Gana 1-2 TF</span>
      </div>

      <div
        className={`${lobbyStyles.modoCard} ${lobbyStyles.modoApuesta} ${modo === 'apuesta' ? lobbyStyles.modoActivo : ''}`}
        onClick={() => setModo('apuesta')}
        style={{ marginTop: 8 }}
      >
        <div className={lobbyStyles.modoHeader}>
          <div className={lobbyStyles.modoRadio} style={{ borderColor: '#FF8000' }}>
            {modo === 'apuesta' && (
              <div className={lobbyStyles.modoRadioFill} style={{ background: '#FF8000' }} />
            )}
          </div>
          <span className={lobbyStyles.modoNombre} style={{ color: '#FF8000' }}>
            Modo Hardcore
          </span>
          <span className={lobbyStyles.modoBadge}>RIESGO</span>
        </div>
        <span className={lobbyStyles.modoDesc}>
          Riesgo total · El perdedor transfiere su Tokagotchi permanentemente
        </span>
        {modo === 'apuesta' && (
          <span className={lobbyStyles.modoWarning}>
            Tu Toka puede ser perdido permanentemente
          </span>
        )}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
        <button
          className={styles.btnPrimary}
          onClick={() => setFase('preparacion')}
        >
          Prepararse
        </button>
      </div>
    </div>
  )
}