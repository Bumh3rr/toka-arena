import TokagotchiCanvas from '../../../components/TofuCanvas/TofuCanvas'
import styles from './Arena.module.css'
import esperaStyles from './EsperaView.module.css'

export default function EsperaView({ batalla }: { batalla: any }) {
  const { tokagotchi, rival, cancelarBusqueda } = batalla
  const encontrado = rival !== null

  return (
    <div className={styles.view} style={{ justifyContent: 'center', alignItems: 'center' }}>
      <h1 className={styles.title} style={{ textAlign: 'center' }}>
        {encontrado ? '¡Rival encontrado!' : 'Buscando rival...'}
      </h1>

      {/* VS */}
      <div className={esperaStyles.vsContainer}>
        <div className={esperaStyles.tokaSlot}>
          <TokagotchiCanvas
            tokagotchi={tokagotchi}
            animacion="idle"
            width={130}
            height={130}
            scale={0.28}
          />
          <span className={esperaStyles.tokaLabel}>{tokagotchi.nombre}</span>
          <span className={esperaStyles.tokaSubLabel}>Tú</span>
        </div>

        <div className={esperaStyles.vsText}>VS</div>

        <div className={esperaStyles.tokaSlot}>
          {encontrado && rival ? (
            <>
              <TokagotchiCanvas
                tokagotchi={rival}
                animacion="idle"
                width={130}
                height={130}
                scale={0.28}
              />
              <span className={esperaStyles.tokaLabel}>{rival.nombre}</span>
              <span className={esperaStyles.tokaSubLabel}>Rival</span>
            </>
          ) : (
            <div className={esperaStyles.unknownSlot}>
              <span className={esperaStyles.unknownText}>???</span>
              <div className={esperaStyles.dots}>
                <div className={esperaStyles.dot} style={{ animationDelay: '0s' }} />
                <div className={esperaStyles.dot} style={{ animationDelay: '0.2s' }} />
                <div className={esperaStyles.dot} style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          {!encontrado && <span className={esperaStyles.tokaLabel}>Buscando...</span>}
        </div>
      </div>

      {encontrado ? (
        <div className={esperaStyles.readyMsg}>
          <span className={esperaStyles.readyText}>¡Preparando batalla!</span>
        </div>
      ) : (
        <button
          className={styles.btnSecondary}
          style={{ marginTop: 24, maxWidth: 240 }}
          onClick={cancelarBusqueda}
        >
          Cancelar
        </button>
      )}
    </div>
  )
}