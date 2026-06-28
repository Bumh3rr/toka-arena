import { useState, useRef, type CSSProperties } from 'react'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import SheetPanel from '@/shared/ui/SheetPanel/SheetPanel'
import { Button } from '@/shared/ui/Kit'
import RenameModal from '@/shared/ui/modal/RenameModal'
import StatsRow from '@/features/home/components/row/StatsRow'
import AccSlot from '../AccSlot'
import { RARITY_META, SPARKLE_COUNT, SPARKLE_POS } from '@/shared/constants/rarity'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import type { ColAcc } from '../../types/collection.types'
import type { EquippedAccessory } from '@/shared/domain/accessory'
import styles from './TokaDetailSheet.module.css'
import { TokaIdentity } from '@/shared/ui/TokaIdentity/TokaIdentity'
import { IcFavorite, IcReady } from '@/shared/ui/Icons/Icons'
import EvoPanel from '@/features/home/components/panel/EvoPanel'

// ── Nombres de accesorios para AccSlot ──────────────────────────────────────
const ACC_DISPLAY_NAME: Record<string, string> = {
  HELMET: 'Casco',
  CROWN: 'Corona',
  HAT: 'Sombrero',
  SUPER_CAPE: 'Super Capa',
}

function toColAcc(ea: EquippedAccessory): ColAcc {
  return {
    id: ea.code,
    name: ACC_DISPLAY_NAME[ea.code] ?? ea.code,
    slot: ea.slot === 'HEAD' ? 'cabeza' : 'cuerpo',
    owned: 1,
    equipped: [],
    locked: false,
    code: ea.code,
    image: null,
  }
}

// ── Props ────────────────────────────────────────────────────────────────────
interface TokaDetailSheetProps {
  tokagotchi: Tokagotchi
  isActive: boolean
  serverTime: number
  tf: number
  onBack: () => void
  onToggleFav: (id: string, fav: boolean) => void
  onActivate: (id: string) => void
  onAscend: (tokaId: string) => Promise<'SUCCESS' | 'FAIL' | null>
  onRename: (tokaId: string, newName: string) => Promise<void>
}

export default function TokaDetailSheet({
  tokagotchi,
  isActive,
  serverTime,
  tf,
  onBack,
  onToggleFav,
  onActivate,
  onAscend,
  onRename,
}: TokaDetailSheetProps) {
  const [sheetExpanded, setSheetExpanded] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)

  const meta = RARITY_META[tokagotchi.rarity]
  const sparkles = SPARKLE_POS.slice(0, SPARKLE_COUNT[tokagotchi.rarity])

  const headEquipped = tokagotchi.equipped.find((e) => e.slot === 'HEAD')
  const bodyEquipped = tokagotchi.equipped.find((e) => e.slot === 'BACK')
  const headAcc = headEquipped ? toColAcc(headEquipped) : undefined
  const bodyAcc = bodyEquipped ? toColAcc(bodyEquipped) : undefined

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
          disabled
          aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        > <IcFavorite /></button>
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

      {/* SheetPanel */}
      <SheetPanel
        expanded={sheetExpanded}
        onExpandedChange={handleExpandedChange}
        onDragging={handleDragging}
        onDragProgress={handleDragProgress}
        topOffset={230}
      >
        {/* Identidad */}
        <TokaIdentity
          cp={tokagotchi.cp}
          name={tokagotchi.name}
          rarity={tokagotchi.rarity}
          species={tokagotchi.species}
          onRename={() => setRenameOpen(true)}
        />

        {/* Stats */}
        <SheetPanel.Separator title="Estadísticas">
          <StatsRow stats={tokagotchi.stats} />
        </SheetPanel.Separator>

        {/* Evolución */}
        <SheetPanel.Separator title="Evolución">
          <EvoPanel
            serverTime={serverTime}
            nextEvolution={tokagotchi.nextEvolution}
            cp={tokagotchi.cp}
            tf={tf}
            onAscend={() => onAscend(tokagotchi.id)}
          />
        </SheetPanel.Separator>

        {/* Slots de accesorios */}
        <SheetPanel.Separator title="Accesorios">
          <div className={styles.slots}>
            <AccSlot label="Cabeza" acc={headAcc} />
            <AccSlot label="Cuerpo" acc={bodyAcc} />
            <AccSlot label="Cuello" future />
            <AccSlot label="Cara" future />
          </div>
        </SheetPanel.Separator>

        {/* Acción principal */}
        <SheetPanel.Separator title="Acción principal">
          <div className={styles.actions}>
            {isActive ? (
              <div className={styles.activeBadge}> <IcReady /> Tokagotchi activo</div>
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
        </SheetPanel.Separator>

      </SheetPanel>

      {renameOpen && (
        <RenameModal
          currentName={tokagotchi.name}
          onSave={async (name) => { await onRename(tokagotchi.id, name); setRenameOpen(false) }}
          onClose={() => setRenameOpen(false)}
        />
      )}
    </div>
  )
}
