import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { useHome } from '../hooks/useHome'
import { useNavBar } from '@/shared/hooks/useNavBar'
import { IcSwap, IcPencil, IcPerson } from '@/shared/ui/Icons/Icons'
import { Button, Label, IconButton, Toast } from '@/shared/ui/Kit'
import StatsRow from '../components/row/StatsRow'
import EvoPanel from '../components/panel/EvoPanel'
import CareRow from '../components/row/CareRow'
import RenameModal from '../components/modal/RenameModal'
import MissionsModal from '../../missions/components/MissionsModal'
import CollectionModal from '../components/modal/CollectionModal'
import TokaStatusPill from '../components/pill/TokaStatusPill'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import BackgroundCanvas from '@/shared/canvas/BackgroundCanvas'
import PerfileModal from '../components/modal/PerfileModal'
import MissionFab from '../../missions/components/MissionFab'
import RarityCard from '@/shared/ui/RarityCard/RarityCard'
import BattlePassCard from '../components/BattlePassCard/BattlePassCard'
import { CoinPillCard } from '../components/CoinPillCard/CoinPillCard'
import styles from './HomePage.module.css'

const TOKA_H = 230            // alto del canvas (== prop height)
const TOKA_OVERLAP = 15       // cuánto se apoya el Toka sobre los controles (ajustable)
const TOKA_TOP_EXPANDED = 50  // top cuando el sheet está expandido (sube bajo el TopBar)
// Vars CSS de geometría (constantes) → fuera del render para no recrear el objeto
const CONTAINER_VARS = {
    '--toka-h': `${TOKA_H}px`,
    '--toka-overlap': `${TOKA_OVERLAP}px`,
    '--toka-top-expanded': `${TOKA_TOP_EXPANDED}px`,
} as CSSProperties

export default function HomePage() {
    const { hideBar, showBar } = useNavBar()
    const {
        tokagotchi, allTokas, username, tf, cp, misiones, loading,
        renameToka, ejecutarAccion, cooldowns, floaters, toast, animation,
    } = useHome()

    const [sheetExpanded, setSheetExpanded] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [perfileOpen, setPerfileOpen] = useState(false)
    const [renameOpen, setRenameOpen] = useState(false)
    const [missionsOpen, setMissionsOpen] = useState(false)
    const [collectionOpen, setCollectionOpen] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const sheetRef = useRef<HTMLDivElement>(null)
    const floatingRef = useRef<HTMLDivElement>(null)
    const tokaWrapRef = useRef<HTMLDivElement>(null)

    const cpRequired = tokagotchi?.evolution?.rule?.cpRequired ?? 0;

    // Oculta/muestra la nav según el estado del sheet (la posición del Toka la
    // resuelve el CSS vía la clase .tokaWrapExpanded, ya no por una variable JS)
    useEffect(() => {
        if (sheetExpanded) hideBar()
        else showBar()
    }, [sheetExpanded, hideBar, showBar])

    // Publica la altura real del bloque de controles flotantes como --floating-h.
    // El Tokagotchi colapsado se ancla sobre él (ver .tokaWrap en el CSS), así que
    // su posición se mantiene correcta en cualquier altura de pantalla.
    useEffect(() => {
        const el = floatingRef.current
        const container = containerRef.current
        if (!el || !container) return
        const ro = new ResizeObserver(([entry]) => {
            const h = entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height
            container.style.setProperty('--floating-h', `${h}px`)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // ── Drag desde el handle del sheet ──────────────────────────────────────────
    const onGrabDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const sheetEl = sheetRef.current
        const container = containerRef.current
        const floatingEl = floatingRef.current
        const tokaEl = tokaWrapRef.current
        if (!sheetEl || !container) return

        const startY = e.clientY
        const startExpanded = sheetExpanded
        const startPct = startExpanded ? 0 : 100   // 0 = expandido · 100 = colapsado
        const shH = sheetEl.offsetHeight        // altura real del panel
        const collapsedTop = floatingEl ? floatingEl.offsetTop - TOKA_H + TOKA_OVERLAP : 0
        let livePct = startPct
        let moved = 0

        setDragging(true)
        e.currentTarget.setPointerCapture(e.pointerId)

        const onMove = (ev: PointerEvent) => {
            const dy = ev.clientY - startY
            moved = Math.max(moved, Math.abs(dy))
            livePct = Math.max(0, Math.min(100, startPct + (dy / shH) * 100))

            sheetEl.style.transform = `translateY(${livePct}%)`

            // El Toka interpola entre arriba (expandido) y sobre los controles (colapsado)
            if (tokaEl) {
                const top = TOKA_TOP_EXPANDED + (collapsedTop - TOKA_TOP_EXPANDED) * livePct / 100
                tokaEl.style.top = `${top}px`
            }

            // Fade continuo de los controles flotantes
            if (floatingEl) floatingEl.style.opacity = `${livePct / 100}`
        }

        const onUp = () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
            // Limpia estilos inline — el CSS (clase) retoma con su transición
            sheetEl.style.transform = ''
            if (tokaEl) tokaEl.style.top = ''
            if (floatingEl) floatingEl.style.opacity = ''
            setDragging(false)
            // Tap = menos de 6px → toggle; drag = decide por posición
            const next = moved < 6 ? !startExpanded : livePct < 50
            setSheetExpanded(next)
        }

        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
        e.preventDefault()
    }

    const handleClaim = () => { }

    return (
        <div
            ref={containerRef}
            className={`${styles.container} ${dragging ? styles.dragging : ''}`}
            style={CONTAINER_VARS}
        >
            <div className={styles.bg}>
                <BackgroundCanvas paused={sheetExpanded} />
            </div>

            <div className={styles.topbar}>
                <div className={styles.user}>
                    <IconButton
                        variant="legend"
                        size={50}
                        shape="round"
                        onClick={() => setPerfileOpen(true)}
                        ariaLabel="Perfil"
                    >
                        <IcPerson />
                    </IconButton>
                    <Label variant="warm" look="soft" size="sm">
                        {loading ? '...' : username}
                    </Label>
                </div>
                <CoinPillCard tf={tf} />
            </div>

            {/* Tokagotchi — absoluto; colapsado se ancla sobre los controles flotantes */}
            <div
                ref={tokaWrapRef}
                className={`${styles.tokaWrap} ${sheetExpanded ? styles.tokaWrapExpanded : ''}`}
            >
                {tokagotchi?.assets && (
                    <TokagotchiCanvas
                        animacionActual={animation}
                        assets={tokagotchi.assets}
                        accesorioIndexCabeza={1}
                        accesorioIndexCuerpo={1}
                        width={230}
                        height={TOKA_H}
                    />
                )}
            </div>

            <div
                ref={floatingRef}
                className={`${styles.floatingControls} ${sheetExpanded ? styles.floatingHidden : ''}`}
            >
                <TokaStatusPill
                    nombre={tokagotchi?.name ?? '...'}
                    rareza={tokagotchi?.rarity}
                    cp={cp}
                    cpMeta={cpRequired}
                    onOpen={() => setSheetExpanded(true)}
                />

                <CareRow
                    cooldowns={cooldowns}
                    floaters={floaters}
                    onUse={ejecutarAccion}
                    showHeader={false}
                />
            </div>

            <div
                ref={sheetRef}
                className={`${styles.sheetPanel} ${sheetExpanded ? styles.sheetPanelExpanded : ''}`}
            >
                <div className={styles.sheetHandle} onPointerDown={onGrabDown}>
                    <div className={styles.sheetGrab} />
                </div>

                <div className={styles.sheetScroll}>
                    <div className={styles.identity}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className={styles.nmWrapper}>
                                <div className={styles.nm}>{tokagotchi?.name ?? '...'}</div>
                                <IconButton
                                    shape='sm'
                                    size={28}
                                    onClick={() => setRenameOpen(true)}
                                    aria-label="Renombrar"
                                >
                                    <IcPencil />
                                </IconButton>
                            </div>
                            <div className={styles.nmRow}>
                                <div className={styles.sub}>
                                    <RarityCard rarity={tokagotchi?.rarity} />
                                    <span>|</span>
                                    <Label variant="warm" look="soft" size="sm">{tokagotchi?.species ?? '...'}</Label>
                                </div>
                                <Button
                                    variant="warm"
                                    size="md"
                                    icon={<IcSwap />}
                                    onClick={() => setCollectionOpen(true)}>Cambiar</Button>
                            </div>

                        </div>
                    </div>

                    {tokagotchi && <StatsRow stats={tokagotchi.stats} />}
                    {tokagotchi && <EvoPanel rareza={tokagotchi.rarity} cp={cp} tf={tf} />}
                </div>
            </div>

            <BattlePassCard season="T1" tier={40} plan='free' top={90} />

            <div className={styles.btnMissionFab}>
                <MissionFab
                    onOpen={() => setMissionsOpen(true)}
                    badge={100}
                />
            </div>

            {toast && <Toast {...toast} />}

            {renameOpen && tokagotchi && (
                <RenameModal
                    currentName={tokagotchi.name}
                    onSave={renameToka}
                    onClose={() => setRenameOpen(false)}
                />
            )}
            {perfileOpen && (
                <PerfileModal onClose={() => setPerfileOpen(false)} />
            )}
            {missionsOpen && (
                <MissionsModal
                    missions={misiones}
                    onClaim={handleClaim}
                    onClose={() => setMissionsOpen(false)}
                />
            )}
            {collectionOpen && (
                <CollectionModal
                    roster={allTokas.length > 0 ? allTokas : (tokagotchi ? [tokagotchi] : [])}
                    activeId={tokagotchi?.id ?? 0}
                    onActivate={() => setCollectionOpen(false)}
                    onClose={() => setCollectionOpen(false)}
                />
            )}
        </div>
    )
}