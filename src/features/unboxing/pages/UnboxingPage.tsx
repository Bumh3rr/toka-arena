import { useNavigate } from 'react-router-dom'
import GiftBox from '../components/GiftBox/GiftBox'
import GenesisReveal from '../components/GenesisReveal/GenesisReveal'
import { useUnboxing } from '../hooks/useUnboxing'
import { Toast } from '@/shared/ui/Kit'
import styles from './UnboxingPage.module.css'

export default function UnboxingPage() {
  const { phase, giftFase, result, startBreaking, renameResult, toast } = useUnboxing()
  const navigate = useNavigate()
  const handleComplete = () => navigate('/home', { replace: true })

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
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
        <div>
          <h1 className={styles.titleBreaking}>¡Se está<br />rompiendo!</h1>
          <GiftBox fase={giftFase} onClick={() => { }} />
        </div>
      )}

      {/* FASE 3 — Revelación génesis (overlay full-screen sobre el fondo) */}
      {phase === 'result' && result?.mainTokagotchi && (
        <GenesisReveal
          tokagotchi={result.mainTokagotchi}
          onStart={handleComplete}
          onRename={renameResult}
        />
      )}

      {/* Toast de mensajes */}
      {toast && <Toast {...toast} />}
    </div>
  )
}
