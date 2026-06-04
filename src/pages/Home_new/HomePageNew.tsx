import { useState, useRef, type CSSProperties } from 'react'
import { useHome } from '../../hooks/useHome'
import CoinPillCard from '../../components/Coin/CoinPillCard'
import MissionFab from '../../components/MissionFab/MissionFab'
import CareSheet from '../../components/CareSheet/CareSheet'
import StatsRow from '../../components/Home/StatsRow'
import EvoPanel from '../../components/Home/EvoPanel'
import CareRow from '../../components/Home/CareRow'
import RenameModal from '../../components/Home/RenameModal'
import MissionsModal from '../../components/Home/MissionsModal'
import CollectionModal from '../../components/Home/CollectionModal'
import TokagotchiCanvas from '../../components/Tokagotchi/TokagotchiCanvas'
import { IcSwap, IcPencil } from '../../components/Icons/Icons'
import type { MisionResponse } from '../../services/userService'
import styles from './HomePageNew.module.css'
import { SCENE_MAX } from '../../components/CareSheet/CareSheet'
import RarityCard from '../../components/RarityCard/RarityCard'

export default function HomePageNew() {
    const {
        tokagotchi, allTokas, username, tf, cp, misiones, loading,
        renameToka, ejecutarAccion, cooldowns, floaters, toast
    } = useHome()

    const [sheetExpanded, setSheetExpanded] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [renameOpen, setRenameOpen] = useState(false)
    const [missionsOpen, setMissionsOpen] = useState(false)
    const [collectionOpen, setCollectionOpen] = useState(false)
    const [coinBump] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)
    const missionAlert = misiones.filter((m: MisionResponse) => m.percentage >= 100 && !m.completed).length

    const handleClaim = (id: number) => {
        console.log('Reclamar misión', id)
    }

    return (
        <div
            ref={containerRef}
            className={`${styles.container} ${dragging ? styles.dragging : ''}`}
            style={{ '--scene-h': `${SCENE_MAX}px` } as CSSProperties}
        >
            {/* Background */}
            <div className={styles.bg} />

            {/* TopBar */}
            <div className={styles.topbar}>
                <div className={styles.user}>
                    <div className={styles.avatar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#4A2800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8.6" r="3.8" fill="#FFF1D4" />
                            <path d="M4.8 20c.6-3.8 3.6-5.6 7.2-5.6s6.6 1.8 7.2 5.6" fill="#FFF1D4" />
                        </svg>
                    </div>
                    <div className={styles.meta}>
                        <span className={styles.hello}>¡Hola!</span>
                        <span className={styles.name}>{loading ? '...' : username}</span>
                    </div>
                </div>
                <CoinPillCard tf={tf} bump={coinBump} />
            </div>

            {/* Scene — height driven by --scene-h */}
            <div className={styles.scene}>
                <div className={styles.containerRarity}>
                    <RarityCard rarity={tokagotchi?.rareza} />
                </div>
                <div className={styles.heroChar}>
                    <TokagotchiCanvas
                        accesorioIndexCabeza={1}
                        accesorioIndexCuerpo={1}
                        animacionActual={'idle'}
                        tokaActual={tokagotchi?.especie}
                        width={230}
                        height={240}
                    />
                </div>
            </div>

            {/* Missions FAB */}
            <MissionFab
                onOpen={() => setMissionsOpen(true)}
                badge={missionAlert}
                lifted={sheetExpanded}
            />

            {/* Care Sheet */}
            <CareSheet
                expanded={sheetExpanded}
                setExpanded={setSheetExpanded}
                containerRef={containerRef}
                onDraggingChange={setDragging}
            >
                {/* Identity */}
                <div className={`${styles.identity} ${sheetExpanded ? styles.identitySticky : ''}`}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className={styles.nmRow}>
                            <div className={styles.nm}>{tokagotchi?.nombre ?? '...'}</div>
                            <button className={styles.pencil} onClick={() => setRenameOpen(true)} aria-label="Renombrar">
                                <IcPencil />
                            </button>
                            <button className={styles.swapPill} onClick={() => setCollectionOpen(true)}>
                                <IcSwap />Cambiar
                            </button>
                        </div>
                        <div className={styles.sub}>{tokagotchi?.especie ?? ''}</div>
                    </div>
                </div>

                {/* Stats */}
                {tokagotchi && <StatsRow stats={tokagotchi.stats} />}

                {/* Care actions */}
                <CareRow cooldowns={cooldowns} floaters={floaters} onUse={ejecutarAccion} />

                {/* Evolution */}
                {tokagotchi && (
                    <EvoPanel rareza={tokagotchi.rareza} cp={cp} tf={tf} />
                )}

                <div style={{ height: 6 }} />
            </CareSheet>

            {/* Toast */}
            {toast && <div className={styles.toast}>{toast}</div>}

            {/* Modals */}
            {renameOpen && tokagotchi && (
                <RenameModal
                    currentName={tokagotchi.nombre}
                    onSave={renameToka}
                    onClose={() => setRenameOpen(false)}
                />
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
                    activeId={tokagotchi?.id ?? ''}
                    onActivate={() => {
                        setCollectionOpen(false)
                    }}
                    onClose={() => setCollectionOpen(false)}
                />
            )}
        </div>
    )
}
