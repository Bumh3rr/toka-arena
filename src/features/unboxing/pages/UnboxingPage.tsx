import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GiftBox from '../components/GiftBox/GiftBox'
import TokaReveal from '../components/TokaReveal/TokaReveal'
import { useUnboxing } from '../hooks/useUnboxing'
import { Button, Toast } from '@/shared/ui/Kit'
import RenameModal from '@/shared/ui/modal/RenameModal'
import styles from './UnboxingPage.module.css'

export default function UnboxingPage() {
  const { phase, giftFase, result, startBreaking, renameResult, toast } = useUnboxing()
  const navigate = useNavigate()
  const [renameOpen, setRenameOpen] = useState(false)
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
      {phase === 'result' && result && (
        <>
          <h1 className={styles.title}>¡Es tuyo!</h1>
          {result.mainTokagotchi && (
            <TokaReveal
              result={result.mainTokagotchi}
              onRenameClick={() => setRenameOpen(true)}
            />
          )}
          <Button
            className={styles.startButton}
            variant="cafe"
            onClick={handleComplete}
            fontSize={20}
            padding="10px"
          >
            ¡Empezar!
          </Button>
        </>
      )}

      {/* Toast de mensajes */}
      {toast && <Toast {...toast} />}

      {/* Modal de renombrar */}
      {renameOpen && result && (
        <RenameModal
          currentName={result?.mainTokagotchi?.name || ''}
          onSave={renameResult}
          onClose={() => setRenameOpen(false)}
        />
      )}
    </div>
  )
}
