import GiftBox from '../../components/GiftBox/GiftBox'
import WoodButton from '../../components/WoodButton/WoodButton'
import { useUnboxing } from '../../hooks/useUnboxing'
import styles from './UnboxingPage.module.css'
import { useNavigate } from 'react-router-dom'

export default function UnboxingPage() {
  const { phase, giftFase, result, startBreaking } = useUnboxing()
  const navigate = useNavigate()
  const handleComplete = () => navigate('/home', { replace: true })

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      {/* FASE 1 — Regalo con animación idle */}
      {phase === 'reveal' && (
        <>
          <h1 className={styles.title}>¡Tu Primer<br />Tokagotchi!</h1>
          <div className={styles.cardWood}>
            <GiftBox fase="idle" onClick={startBreaking} />
            <p className={styles.hint}>Toca para revelar</p>
          </div>
        </>
      )}

      {/* FASE 2 — Regalo vibrando y explotando */}
      {phase === 'breaking' && (
        <>
          <h1 className={styles.titleBreaking}>¡Se está<br />rompiendo!</h1>
          <GiftBox fase={giftFase} onClick={() => { }} />
        </>
      )}

      {/* FASE 3 — Tokagotchi revelado */}
      {phase === 'result' && (
        <>
          <h1 className={styles.title}>¡Es Tuyo!</h1>
          <div className={styles.card}>

            {result && (
              <>
                <div className={styles.itemImgWrapper}>
                  <img
                    src={`/assets/tokagotchis/${result.especie.toLocaleLowerCase()}.png`}
                    alt={result.id}
                    className={styles.itemImg}
                  />
                </div>

                <p className={styles.tokaName}>{result.nombre}</p>
                <p className={styles.tokaType}>
                  {result.especie.charAt(0).toUpperCase() + result.especie.slice(1)} · {result.rareza}
                </p>
              </>
            )}

          </div>
          <WoodButton
            label="¡Empezar!"
            onClick={handleComplete}
            width="300px"
          />
        </>
      )}
    </div>
  )
}