import TokagotchiCanvas from '../../../components/TofuCanvas/TofuCanvas'
import styles from './Arena.module.css'
import batallaStyles from './BatallaView.module.css'
import { TOFU_MOCK } from '../../../constants/tokagotchis'

export default function BatallaView({ batalla }: { batalla: any }) {
  const { tokagotchi, rival, estadoBatalla, usarHabilidad } = batalla
  const estado = estadoBatalla

  const hpPctJugador = (estado.hpJugador / estado.hpMaxJugador) * 100
  const hpPctRival = (estado.hpRival / estado.hpMaxRival) * 100
  const nrgPct = (estado.nrgJugador / 100) * 100
  const hpBajoJugador = hpPctJugador < 30

  return (
    <div className={batallaStyles.container}>
      {/* Turno */}
      <div className={batallaStyles.turnoBar}>
        <span className={batallaStyles.turnoText}>Turno {estado.turno}</span>
        <span className={batallaStyles.turnoEstado} style={{
          color: estado.esMiTurno ? '#43A047' : '#EF5350'
        }}>
          {estado.esMiTurno ? 'Tu turno' : 'Turno del rival'}
        </span>
      </div>

      {/* Rival */}
      <div className={batallaStyles.rivalSection}>
        <div className={batallaStyles.rivalInfo}>
          <span className={batallaStyles.rivalNombre}>{rival?.nombre ?? 'Rival'}</span>
          <div className={styles.hpBar}>
            <div
              className={styles.hpFill}
              style={{ width: `${hpPctRival}%` }}
            />
          </div>
          <span className={batallaStyles.hpText}>
            {estado.hpRival} / {estado.hpMaxRival} HP
          </span>
        </div>
        <TokagotchiCanvas
          tokagotchi={rival ?? TOFU_MOCK}
          animacion="idle"
          width={110}
          height={110}
          scale={0.25}
        />
      </div>

      {/* Log */}
      <div className={batallaStyles.log}>
        {estado.log.slice(-2).map((msg: string, i: number) => (
          <span key={i} className={batallaStyles.logText}>{msg}</span>
        ))}
      </div>

      {/* Jugador */}
      <div className={batallaStyles.jugadorSection}>
        <TokagotchiCanvas
          tokagotchi={tokagotchi}
          animacion="idle"
          width={110}
          height={110}
          scale={0.25}
        />
        <div className={batallaStyles.jugadorInfo}>
          <span className={batallaStyles.rivalNombre}>{tokagotchi.nombre}</span>
          <div className={styles.hpBar}>
            <div
              className={`${styles.hpFill} ${hpBajoJugador ? styles.hpFillLow : ''}`}
              style={{ width: `${hpPctJugador}%` }}
            />
          </div>
          <span className={batallaStyles.hpText}>
            {estado.hpJugador} / {estado.hpMaxJugador} HP
          </span>
          <div className={styles.nrgBar} style={{ marginTop: 4 }}>
            <div className={styles.nrgFill} style={{ width: `${nrgPct}%` }} />
          </div>
          <span className={batallaStyles.nrgText}>{estado.nrgJugador} NRG</span>
        </div>
      </div>

      {/* Habilidades */}
      <div className={batallaStyles.habilidadesSection}>
        <span className={batallaStyles.secLabel}>Habilidades</span>
        <div className={batallaStyles.habilidadesGrid}>
          {tokagotchi.habilidades.map((hab: any) => {
            const sinNRG = estado.nrgJugador < hab.costoNRG
            return (
              <button
                key={hab.id}
                className={`${batallaStyles.habBtn} ${hab.esSignature ? batallaStyles.habSignature : ''} ${sinNRG ? batallaStyles.habDisabled : ''}`}
                onClick={() => !sinNRG && estado.esMiTurno && usarHabilidad(hab.id)}
                disabled={sinNRG || !estado.esMiTurno}
              >
                <span className={batallaStyles.habNombre}>
                  {hab.esSignature ? '★ ' : ''}{hab.nombre}
                </span>
                <span className={batallaStyles.habNRG}>{hab.costoNRG} NRG</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}