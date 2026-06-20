import GiftBox from '../components/GiftBox/GiftBox'
import { useUnboxing } from '../hooks/useUnboxing'
import styles from './UnboxingPage.module.css'
import { useNavigate } from 'react-router-dom'
import { Card, IconButton, Label, Button, Toast } from '@/shared/ui/Kit'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import { IcPencil } from '@/shared/ui/Icons/Icons'
import RarityCard from '@/shared/ui/RarityCard/RarityCard'
import RenameModal from '@/shared/ui/modal/RenameModal'
import { useState } from 'react'

export default function UnboxingPage() {
  const { phase, giftFase, result, startBreaking, toast } = useUnboxing()
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
      {phase === 'result' && (
        <>
          <h1 className={styles.title}>¡Es Tuyo!</h1>
          <Card className={styles.card} radius='lg' shadow='md' variant='warm'>

            {result && (
              <>
                <div className={styles.itemWrapper}>
                  <TokagotchiCanvas
                    width={230}
                    height={230}
                    species={result.species}
                  />
                </div>
                <div className={styles.nmWrapper}>
                  <p className={styles.nm}>{result.name}</p>
                  <IconButton
                    shape='sm'
                    size={28}
                    onClick={() => setRenameOpen(true)}
                    aria-label="Renombrar"
                  >
                    <IcPencil />
                  </IconButton>
                </div>
                <Label variant="warm" look="soft" size="sm">{result.species}</Label>
                <RarityCard rarity={result.rarity} />
              </>
            )}
          </Card>

          <Button
            className={styles.startButton}
            variant='cafe'
            onClick={handleComplete}
            fontSize={20}
            padding='10px'
          >
            ¡Empezar!
          </Button>
        </>
      )}


      {/* Toast */}
      {toast && <Toast {...toast} />}

      {/* Modals */}
      {renameOpen && (
        <RenameModal
          currentName={result?.name || ''}
          onSave={Promise<void> as any}
          onClose={() => setRenameOpen(false)}
        />
      )}
    </div>
  )
}