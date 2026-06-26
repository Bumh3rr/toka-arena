import { useState, useRef, type CSSProperties } from 'react'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import SheetPanel from '@/shared/ui/SheetPanel/SheetPanel'
import { Button, IconButton, Label, ProgressBar } from '@/shared/ui/Kit'
import { IcPencil } from '@/shared/ui/Icons/Icons'
import RarityCard from '@/shared/ui/RarityCard/RarityCard'
import RenameModal from '@/shared/ui/modal/RenameModal'
import StatsRow from '@/features/home/components/row/StatsRow'
import AccSlot from '../AccSlot'
import { RARITY_META } from '@/shared/constants/rarity'
import { SPECIES_LABEL } from '@/shared/constants/tokagotchi'
import type { Tokagotchi, Rarity } from '@/shared/domain/tokagotchi'
import type { ColAcc } from '../../types/collection.types'
import type { EquippedAccessory } from '@/shared/domain/accessory'
import styles from './TokaDetailSheet.module.css'

// ── Sparkles ────────────────────────────────────────────────────────────────
const SPARKLE_POS: CSSProperties[] = [
  { top: '14%', left: '16%' },
  { top: '9%',  left: '50%' },
  { top: '16%', right: '14%' },
  { top: '52%', left: '8%' },
  { top: '46%', right: '10%' },
  { top: '74%', left: '20%' },
  { top: '70%', right: '18%' },
]
const SPARKLE_COUNT: Record<Rarity, number> = { COMMON: 3, RARE: 4, EPIC: 5, LEGENDARY: 7 }

// ── Nombres de accesorios para AccSlot ──────────────────────────────────────
const ACC_DISPLAY_NAME: Record<string, string> = {
  HELMET:     'Casco',
  CROWN:      'Corona',
  HAT:        'Sombrero',
  SUPER_CAPE: 'Super Capa',
}

function toColAcc(ea: EquippedAccessory): ColAcc {
  return {
    id:       ea.code,
    name:     ACC_DISPLAY_NAME[ea.code] ?? ea.code,
    slot:     ea.slot === 'HEAD' ? 'cabeza' : 'cuerpo',
    owned:    1,
    equipped: [],
    locked:   false,
    code:     ea.code,
    image:    null,
  }
}

// ── Props ────────────────────────────────────────────────────────────────────
interface TokaDetailSheetProps {
  tokagotchi: Tokagotchi
  isActive: boolean
  onBack: () => void
  onToggleFav: (id: string, fav: boolean) => void
  onActivate: (id: string) => void
}

export default function TokaDetailSheet({
  tokagotchi,
  isActive,
  onBack,
  onToggleFav,
  onActivate,
}: TokaDetailSheetProps) {
  const [sheetExpanded, setSheetExpanded] = useState(true)
  const [exiting, setExiting]           = useState(false)
  const [isFav, setIsFav]               = useState(tokagotchi.fav ?? false)
  const [renameOpen, setRenameOpen]     = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)

  const meta     = RARITY_META[tokagotchi.rarity]
  const sparkles = SPARKLE_POS.slice(0, SPARKLE_COUNT[tokagotchi.rarity])
  const showEvo  = tokagotchi.nextEvolution.nextRarity !== 'MAX'

  const headEquipped = tokagotchi.equipped.find((e) => e.slot === 'HEAD')
  const bodyEquipped = tokagotchi.equipped.find((e) => e.slot === 'BACK')
  const headAcc      = headEquipped ? toColAcc(headEquipped) : undefined
  const bodyAcc      = bodyEquipped ? toColAcc(bodyEquipped) : undefined

  const cpRequired = tokagotchi.nextEvolution.cpRequired
  const evoPct     = cpRequired > 0 ? Math.min(100, Math.round((tokagotchi.cp / cpRequired) * 100)) : 0

  const themeVars = { '--glow-soft': meta.soft } as CSSProperties

  // Desvanece el overlay mientras el usuario arrastra el sheet hacia abajo
  const handleDragProgress = (progress: number) => {
    if (overlayRef.current) {
      overlayRef.current.style.opacity = `${Math.max(0, 1 - progress * 0.55)}`
    }
  }

  // Limpia el opacity inline al soltar el drag
  const handleDragging = (isDragging: boolean) => {
    if (!isDragging && overlayRef.current) {
      overlayRef.current.style.opacity = ''
    }
  }

  // Al colapsar el sheet → animación de salida + onBack
  const handleExpandedChange = (next: boolean) => {
    setSheetExpanded(next)
    if (!next) {
      setExiting(true)
      setTimeout(() => onBack(), 280)
    }
  }

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay}${exiting ? ` ${styles.exiting}` : ''}`}
      style={themeVars}
    >
      {/* Background */}
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.bgGradient} aria-hidden="true" />

      {/* Topbar — solo favorito */}
      <div className={styles.topbar}>
        <button
          type="button"
          className={`${styles.btn} ${isFav ? styles.favOn : ''}`}
          onClick={() => {
            const next = !isFav
            setIsFav(next)
            onToggleFav(tokagotchi.id, next)
          }}
          aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3l2.3 6.2 6.5 0-5.2 4.1 1.9 6.3L12 15.8l-5.5 3.8 1.9-6.3-5.2-4.1 6.5 0z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Hero: canvas animado + glow + sparkles */}
      <div className={styles.heroArea} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.sparkles}>
          {sparkles.map((pos, i) => (
            <span
              key={i}
              className={styles.sparkle}
              style={{ ...pos, animationDelay: `${i * 0.38}s` }}
            />
          ))}
        </div>
        <div className={styles.tokaWrap}>
          <div className={styles.toka}>
            <TokagotchiCanvas
              width={200}
              height={200}
              species={tokagotchi.species}
              accessories={tokagotchi.equipped}
              animacionActual="idle"
            />
          </div>
        </div>
      </div>

      {/* SheetPanel: arranca expandido; arrastrar hacia abajo cierra con estilo */}
      <SheetPanel
        expanded={sheetExpanded}
        onExpandedChange={handleExpandedChange}
        onDragging={handleDragging}
        onDragProgress={handleDragProgress}
        topOffset={230}
      >
        {/* Identidad */}
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{tokagotchi.name}</span>
            <IconButton shape="sm" size={28} onClick={() => setRenameOpen(true)} ariaLabel="Renombrar">
              <IcPencil />
            </IconButton>
          </div>
          <div className={styles.badgeRow}>
            <RarityCard rarity={tokagotchi.rarity} />
            <span>·</span>
            <Label variant="warm" look="soft" size="sm">{SPECIES_LABEL[tokagotchi.species]}</Label>
          </div>
          <span className={styles.cpLine}>{tokagotchi.cp} CP</span>
        </div>

        {/* Stats */}
        <StatsRow stats={tokagotchi.stats} />

        {/* Evolución */}
        {showEvo && (
          <>
            <h3 className={styles.secHeader}>Evolución</h3>
            <div className={styles.evo}>
              <p className={styles.evoTitle}>
                Ascender a {tokagotchi.nextEvolution.nextRarity}
              </p>
              <div>
                <div className={styles.evoBarTop}>
                  <span>CP</span>
                  <b>{tokagotchi.cp} / {tokagotchi.nextEvolution.cpRequired}</b>
                </div>
                <ProgressBar
                  pct={evoPct}
                  color="linear-gradient(180deg,#8FD96A,var(--green))"
                />
              </div>
              <p className={styles.evoCost}>
                Costo: {tokagotchi.nextEvolution.tfRequired} TF
              </p>
            </div>
          </>
        )}

        {/* Slots de accesorios */}
        <h3 className={styles.secHeader}>Accesorios equipados</h3>
        <div className={styles.slots}>
          <AccSlot label="Cabeza"  acc={headAcc} />
          <AccSlot label="Cuerpo"  acc={bodyAcc} />
          <AccSlot label="Cara"    future />
          <AccSlot label="Espalda" future />
        </div>

        {/* Acción principal */}
        <div className={styles.actions}>
          {isActive ? (
            <div className={styles.activeBadge}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Tokagotchi activo
            </div>
          ) : (
            <Button
              variant="green"
              size="lg"
              fullWidth
              onClick={() => onActivate(tokagotchi.id)}
            >
              Activar como principal
            </Button>
          )}
        </div>
      </SheetPanel>

      {renameOpen && (
        <RenameModal
          currentName={tokagotchi.name}
          onSave={async () => { setRenameOpen(false) }}
          onClose={() => setRenameOpen(false)}
        />
      )}
    </div>
  )
}
