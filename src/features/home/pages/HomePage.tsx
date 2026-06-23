import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHome } from '../hooks/useHome'
import { useNavBar } from '@/shared/hooks/useNavBar'
import { IcSwap, IcPencil, IcPerson } from '@/shared/ui/Icons/Icons'
import { Button, Label, IconButton, Toast } from '@/shared/ui/Kit'
import StatsRow from '../components/row/StatsRow'
import EvoPanel from '../components/panel/EvoPanel'
import CareRow from '../components/row/CareRow'
import RenameModal from '../../../shared/ui/modal/RenameModal'
import MissionsModal from '../../missions/components/MissionsModal'
//import CollectionModal from '../../../shared/ui/modal/CollectionModal'
import TokaStatusPill from '../components/pill/TokaStatusPill'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import BackgroundCanvas from '@/shared/canvas/BackgroundCanvas'
import PerfileModal from '../../../shared/ui/modal/PerfileModal'
import MissionFab from '../../missions/components/MissionFab'
import RarityCard from '@/shared/ui/RarityCard/RarityCard'
import BattlePassCard from '../components/BattlePassCard/BattlePassCard'
import { CoinPillCard } from '../components/CoinPillCard/CoinPillCard'
import HomeSkeleton from '../components/skeleton/HomeSkeleton'
import PageError from '../../../shared/ui/Error/Error'
import styles from './HomePage.module.css'

// ── Geometría del Tokzagotchi flotante ──────────────────────────────────────────
const TOKA_H = 230            // alto del canvas (== prop height)
const TOKA_OVERLAP = 15       // cuánto se apoya el Toka sobre los controles
const TOKA_TOP_EXPANDED = 50  // top cuando el sheet está expandido
const CONTAINER_VARS = {
    '--toka-h': `${TOKA_H}px`,
    '--toka-overlap': `${TOKA_OVERLAP}px`,
    '--toka-top-expanded': `${TOKA_TOP_EXPANDED}px`,
} as CSSProperties

export default function HomePage() {
    const navigate = useNavigate()
    const { hideBar, showBar } = useNavBar()
    const { state, runAction, renameToka, ascend, reload, toast } = useHome()

    const [sheetExpanded, setSheetExpanded] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [perfileOpen, setPerfileOpen] = useState(false)
    const [renameOpen, setRenameOpen] = useState(false)
    const [missionsOpen, setMissionsOpen] = useState(false)
    //const [collectionOpen, setCollectionOpen] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const sheetRef = useRef<HTMLDivElement>(null)
    const floatingRef = useRef<HTMLDivElement>(null)
    const tokaWrapRef = useRef<HTMLDivElement>(null)

    const ready = state.status === 'ready'
    const player = ready ? state.data.player : null
    const mainTokagotchi = player?.mainTokagotchi ?? null

    // Simulacion que redirecciona al apartado del pase de batalla, cambiar a /pase
    const onNavegatePasePage = () => { navigate('/ui-kit', { replace: true }) }

    // Oculta/muestra la nav según el estado del sheet
    useEffect(() => {
        if (sheetExpanded) hideBar()
        else showBar()
    }, [sheetExpanded, hideBar, showBar])

    // Publica la altura real del bloque flotante como --floating-h (el Toka colapsado
    // se ancla sobre él). Re-observa cuando montamos la vista "ready".
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
    }, [ready])

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
        const shH = sheetEl.offsetHeight
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
            if (tokaEl) {
                const top = TOKA_TOP_EXPANDED + (collapsedTop - TOKA_TOP_EXPANDED) * livePct / 100
                tokaEl.style.top = `${top}px`
            }
            if (floatingEl) floatingEl.style.opacity = `${livePct / 100}`
        }

        const onUp = () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
            sheetEl.style.transform = ''
            if (tokaEl) tokaEl.style.top = ''
            if (floatingEl) floatingEl.style.opacity = ''
            setDragging(false)
            const next = moved < 6 ? !startExpanded : livePct < 50
            setSheetExpanded(next)
        }

        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
        e.preventDefault()
    }

    // ── Estados de la pantalla ──────────────────────────────────────────────────
    if (state.status === 'loading') return <HomeSkeleton />
    if (state.status === 'error') return <PageError message={state.error} onRetry={reload} />
    // Sin toka: redirige a /unboxing (efecto de arriba); skeleton mientras navega
    if (!mainTokagotchi) return <HomeSkeleton />

    const { cooldowns, ui, data } = state
    const cpMeta = mainTokagotchi.nextEvolution?.cpRequired ?? 0

    const tf = player?.tf ?? 0
    const username = player?.username ?? '...'

    const handleClaim = () => {
        // TODO: reclamar misión (endpoint pendiente)
    }

    return (
        <div
            ref={containerRef}
            className={`${styles.container} ${dragging ? styles.dragging : ''}`}
            style={CONTAINER_VARS}
        >
            {/* Background */}
            <div className={styles.bg}>
                <BackgroundCanvas paused={sheetExpanded} />
            </div>

            {/* Header: username/TF/avatar */}
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
                    <Label variant="warm" look="soft" size="sm">{username}</Label>
                </div>
                <CoinPillCard tf={tf} />
            </div>

            {/* Tokagotchi */}
            <div
                ref={tokaWrapRef}
                className={`${styles.tokaWrap} ${sheetExpanded ? styles.tokaWrapExpanded : ''}`}
            >
                <TokagotchiCanvas
                    animacionActual={ui.animation}
                    species={mainTokagotchi.species}
                    accessories={mainTokagotchi.equipped}
                    width={230}
                    height={TOKA_H}
                />
            </div>

            {/* Controles flotantes */}
            <div
                ref={floatingRef}
                className={`${styles.floatingControls} ${sheetExpanded ? styles.floatingHidden : ''}`}
            >
                <TokaStatusPill
                    nombre={mainTokagotchi.name}
                    rareza={mainTokagotchi.rarity}
                    cp={mainTokagotchi.cp}
                    cpMeta={cpMeta}
                    onOpen={() => setSheetExpanded(true)}
                />

                <CareRow
                    cooldowns={cooldowns}
                    floaters={ui.floaters}
                    onUse={runAction}
                    showHeader={false}
                />
            </div>

            {/* Sheet panel */}
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
                                <div className={styles.nm}>{mainTokagotchi.name}</div>
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
                                    <RarityCard rarity={mainTokagotchi.rarity} />
                                    <span>|</span>
                                    <Label variant="warm" look="soft" size="sm">{mainTokagotchi.species}</Label>
                                </div>
                                <Button
                                    variant="warm"
                                    size="md"
                                    icon={<IcSwap />}
                                    onClick={() => {{/** setCollectionOpen(true) */}}}>Cambiar</Button>
                            </div>
                        </div>
                    </div>
                    <StatsRow stats={mainTokagotchi.stats} />
                    <EvoPanel serverTime={data.player.serverTime} nextEvolution={mainTokagotchi.nextEvolution} cp={mainTokagotchi.cp} tf={tf} onAscend={ascend} />
                </div>
            </div>

            {/* Card de Pase de Batalla — la data sale de usePass (/pass) */}
            <BattlePassCard onClick={onNavegatePasePage} top={90} />

            {/* FAB de Misiones */}
            <div className={styles.btnMissionFab}>
                <MissionFab
                    onOpen={() => setMissionsOpen(true)}
                    badge={data.missions.claimable}
                />
            </div>

            {/* Toast */}
            {toast && <Toast {...toast} />}

            {/* Modales */}
            {renameOpen && (
                <RenameModal
                    currentName={mainTokagotchi.name}
                    sub='Elige un apodo para tu Tokagotchi activo.'
                    limit={14}
                    onSave={renameToka}
                    onClose={() => setRenameOpen(false)}
                />
            )}
            {perfileOpen && (
                <PerfileModal onClose={() => setPerfileOpen(false)} />
            )}
            {missionsOpen && (
                <MissionsModal
                    missions={[]} // TODO: la lista de misiones viene de la feature missions (useMissions/endpoint), no de useHome
                    onClaim={handleClaim}
                    onClose={() => setMissionsOpen(false)}
                />
            )}
            {/** 
            {collectionOpen && (
                <CollectionModal
                    roster={[]} // TODO: el roster viene de la feature collection (useCollection/endpoint)
                    activeId={mainTokagotchi.id}
                    onActivate={() => setCollectionOpen(false)}
                    onClose={() => setCollectionOpen(false)}
                />
            )}
                */}
        </div>
    )
}
