import { useState, useRef, type CSSProperties, type PointerEvent } from 'react'
import Portal from '@/shared/ui/Portal/Portal'
import type { AccessorySlot } from '@/shared/domain/accessory'
import AccEquipSheet from '../AccEquipSheet/AccEquipSheet'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import SheetPanel from '@/shared/ui/Sheet/SheetPanel/SheetPanel'
import { Button } from '@/shared/ui/Kit'
import RenameModal from '@/shared/ui/modal/RenameModal'
import StatsRow from '@/shared/ui/Tokagotchi/Row/StatsRow'
import AccSlot from '../AccSlot'
import { RARITY_META, SPARKLE_COUNT, SPARKLE_POS } from '@/shared/constants/rarity'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import styles from './TokaDetailSheet.module.css'
import TokaIdentity from '@/shared/ui/Tokagotchi/TokaIdentity/TokaIdentity'
import { IcFavorite, IcReady } from '@/shared/ui/Icons/Icons'
import EvoPanel from '@/features/home/components/panel/EvoPanel'

const SLIDE_W = 176  // horizontal offset between carousel items (px)

// ── Props ────────────────────────────────────────────────────────────────────
interface TokaDetailSheetProps {
  tokagotchiGroup: Tokagotchi[]
  activeTokaId: string | null
  serverTime: number
  tf: number
  onBack: () => void
  onToggleFav: (id: string, fav: boolean) => void
  onActivate: (id: string) => void
  onAscend: (tokaId: string) => Promise<'SUCCESS' | 'FAIL' | null>
  onRename: (tokaId: string, newName: string) => Promise<void>
  onEquipChange: () => void
}

// ── Carrusel del hero ────────────────────────────────────────────────────────
interface HeroCarouselProps {
  tokas: Tokagotchi[]
  currentIndex: number
  onChangeIndex: (i: number) => void
}

function HeroCarousel({ tokas, currentIndex, onChangeIndex }: HeroCarouselProps) {
  const dragStartX = useRef<number | null>(null)
  const [liveOffset, setLiveOffset] = useState(0)
  const isAnimating = liveOffset === 0

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return
    setLiveOffset(e.clientX - dragStartX.current)
  }

  const onPointerUp = () => {
    if (dragStartX.current === null) return
    const THRESHOLD = 55
    if (liveOffset < -THRESHOLD && currentIndex < tokas.length - 1) {
      onChangeIndex(currentIndex + 1)
    } else if (liveOffset > THRESHOLD && currentIndex > 0) {
      onChangeIndex(currentIndex - 1)
    }
    setLiveOffset(0)
    dragStartX.current = null
  }

  return (
    <div
      className={styles.carousel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {tokas.map((t, i) => {
        const rawOffset = (i - currentIndex) * SLIDE_W + liveOffset
        const absStep = Math.abs(i - currentIndex)
        const scale = Math.max(0.38, 1 - absStep * 0.32)
        const opacity = Math.max(0.15, 1 - absStep * 0.45)
        return (
          <div
            key={t.id}
            className={styles.carouselItem}
            style={{
              transform: `translateX(${rawOffset}px) scale(${scale})`,
              opacity,
              zIndex: 10 - absStep,
              transition: isAnimating
                ? 'transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease'
                : 'none',
            }}
            onClick={() => absStep > 0 && onChangeIndex(i)}
          >
            <TokagotchiCanvas
              width={178}
              height={178}
              species={t.species}
              accessories={t.equipped}
              animacionActual="idle"
            />
          </div>
        )
      })}

      {/* Dot indicators */}
      <div className={styles.carouselDots}>
        {tokas.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
            onClick={() => onChangeIndex(i)}
            aria-label={`Tokagotchi ${i + 1} de ${tokas.length}`}
          />
        ))}
      </div>

      {/* Counter badge */}
      <div className={styles.carouselCounter}>
        {currentIndex + 1} / {tokas.length}
      </div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function TokaDetailSheet({
  tokagotchiGroup,
  activeTokaId,
  serverTime,
  tf,
  onBack,
  onToggleFav,
  onActivate,
  onAscend,
  onRename,
  onEquipChange,
}: TokaDetailSheetProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sheetExpanded, setSheetExpanded] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [activeSlot, setActiveSlot] = useState<AccessorySlot | null>(null)

  const overlayRef = useRef<HTMLDivElement>(null)

  const safeIndex = Math.min(currentIndex, tokagotchiGroup.length - 1)
  const tokagotchi = tokagotchiGroup[safeIndex]
  const isActive = activeTokaId === tokagotchi.id
  const isGroup = tokagotchiGroup.length > 1

  const meta = RARITY_META[tokagotchi.rarity]
  const sparkles = SPARKLE_POS.slice(0, SPARKLE_COUNT[tokagotchi.rarity])

  const slotMap = Object.fromEntries(tokagotchi.equipped.map(e => [e.slot, e]))

  const themeVars = { '--glow-soft': meta.soft } as CSSProperties

  const handleDragProgress = (progress: number) => {
    if (overlayRef.current) {
      overlayRef.current.style.opacity = `${Math.max(0, 1 - progress * 0.55)}`
    }
  }

  const handleDragging = (isDragging: boolean) => {
    if (!isDragging && overlayRef.current) {
      overlayRef.current.style.opacity = ''
    }
  }

  const handleExpandedChange = (next: boolean) => {
    setSheetExpanded(next)
    if (!next) {
      setExiting(true)
      setTimeout(() => onBack(), 280)
    }
  }

  const overlay = (
    <div
      ref={overlayRef}
      className={`${styles.overlay}${exiting ? ` ${styles.exiting}` : ''}`}
      style={themeVars}
    >
      {/* Background */}
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.bgGradient} aria-hidden="true" />

      {/* Topbar — favorito */}
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
        >
          <IcFavorite />
        </button>
      </div>

      {/* Hero: canvas / carrusel + glow + sparkles */}
      <div className={styles.heroArea} aria-hidden="true">
        <div className={styles.glow} />

        {isGroup ? (
          <HeroCarousel
            tokas={tokagotchiGroup}
            currentIndex={safeIndex}
            onChangeIndex={setCurrentIndex}
          />
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* SheetPanel */}
      <SheetPanel
        expanded={sheetExpanded}
        onExpandedChange={handleExpandedChange}
        onDragging={handleDragging}
        onDragProgress={handleDragProgress}
        topOffset={230}
      >
        <TokaIdentity
          cp={tokagotchi.cp}
          name={tokagotchi.name}
          rarity={tokagotchi.rarity}
          species={tokagotchi.species}
          onRename={() => setRenameOpen(true)}
        />

        <SheetPanel.Separator title="Estadísticas">
          <StatsRow stats={tokagotchi.stats} />
        </SheetPanel.Separator>

        <SheetPanel.Separator title="Evolución">
          <EvoPanel
            serverTime={serverTime}
            nextEvolution={tokagotchi.nextEvolution}
            cp={tokagotchi.cp}
            tf={tf}
            onAscend={() => onAscend(tokagotchi.id)}
          />
        </SheetPanel.Separator>

        <SheetPanel.Separator title="Accesorios">
          <div className={styles.slots}>
            <AccSlot label="Cabeza"  acc={slotMap['HEAD']} onClick={() => setActiveSlot('HEAD')} />
            <AccSlot label="Cara"    acc={slotMap['FACE']} onClick={() => setActiveSlot('FACE')} />
            <AccSlot label="Espalda" acc={slotMap['BACK']} onClick={() => setActiveSlot('BACK')} />
            <AccSlot label="Cuello"  future />
          </div>
        </SheetPanel.Separator>

        <SheetPanel.Separator title="Acción principal">
          <div className={styles.actions}>
            {isActive ? (
              <div className={styles.activeBadge}>
                <IcReady /> Tokagotchi activo
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
        </SheetPanel.Separator>
      </SheetPanel>

      {renameOpen && (
        <RenameModal
          currentName={tokagotchi.name}
          onSave={async (name) => {
            await onRename(tokagotchi.id, name)
            setRenameOpen(false)
          }}
          onClose={() => setRenameOpen(false)}
        />
      )}

      {activeSlot && (
        <AccEquipSheet
          slot={activeSlot}
          tokaId={tokagotchi.id}
          equippedAccId={slotMap[activeSlot]?.id}
          onClose={() => setActiveSlot(null)}
          onEquipChange={onEquipChange}
        />
      )}
    </div>
  )

  // Portal a <body>: saca el overlay del scroll de FeatureScreen .content, que en
  // iOS WebKit desplaza el position:fixed con el scroll (ver Portal).
  return <Portal>{overlay}</Portal>
}
