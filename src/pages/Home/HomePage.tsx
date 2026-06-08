import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { useHome } from '../../hooks/useHome'
import { CoinPillCard } from '../../components/Card/CoinPillCard'
import MissionFab from '../../components/MissionFab/MissionFab'
import CareSheet from '../../components/CareSheet/CareSheet'
import StatsRow from '../../components/Home/StatsRow'
import EvoPanel from '../../components/Home/EvoPanel'
import CareRow from '../../components/Home/CareRow'
import RenameModal from '../../components/Home/RenameModal'
import MissionsModal from '../../components/Home/MissionsModal'
import CollectionModal from '../../components/Home/CollectionModal'
import TokagotchiCanvas from '../../components/Tokagotchi/TokagotchiCanvas'
import { IcSwap, IcPencil, IcPerson } from '../../components/Icons/Icons'
import type { MisionResponse } from '../../services/userService'
import styles from './HomePage.module.css'
import { SCENE_MAX } from '../../components/CareSheet/CareSheet'
import RarityCard from '../../components/RarityCard/RarityCard'
import BackgroundCanvas from '../../components/Background/BackgroundCanvas'
import { Button, Label, IconButton, Toast } from '../../components/UIKit'
import PerfileModal from '../../components/Home/PerfileModal'
import { useNavBar } from '../../hooks/useNavBar'

export default function HomePage() {
    const { hideBar, showBar } = useNavBar();
    const {
        tokagotchi, allTokas, username, tf, cp, misiones, loading,
        renameToka, ejecutarAccion, cooldowns, floaters, toast, animation
    } = useHome()

    const [sheetExpanded, setSheetExpanded] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [perfileOpen, setPerfileOpen] = useState(false)
    const [renameOpen, setRenameOpen] = useState(false)
    const [missionsOpen, setMissionsOpen] = useState(false)
    const [collectionOpen, setCollectionOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)
    const missionAlert = misiones.filter((m: MisionResponse) => m.percentage >= 100 && !m.completed).length

     useEffect(() => {
        if (sheetExpanded) {
            hideBar();
        } else {
            showBar();
        }
    }, [sheetExpanded])
 
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
            <div className={styles.bg}>
                <BackgroundCanvas paused={sheetExpanded} />
            </div>

            {/* TopBar */}
            <div className={styles.topbar}>
                <div className={styles.user}>
                    <IconButton variant="legend" size={50} shape="round" onClick={() => setPerfileOpen(true)} aria-label="Perfil">
                        <IcPerson />
                    </IconButton>
                    <Label key={'Especie-Tokagotchi'} variant={'warm'} look="soft" size="sm">
                        {loading ? '...' : username}
                    </Label>
                </div>
                <CoinPillCard tf={tf} />
            </div>

            {/* Scene — height driven by --scene-h */}
            <div className={styles.scene}>
                {tokagotchi?.assets && (
                    <TokagotchiCanvas
                        accesorioIndexCabeza={1}
                        accesorioIndexCuerpo={1}
                        animacionActual={animation}
                        assets={tokagotchi.assets}
                        width={230}
                        height={230}
                    />
                )}
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
                <div className={`${styles.identity}`}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className={styles.nmRow}>
                            <div className={styles.nmWrapper}>
                                <div className={styles.nm}>{tokagotchi?.nombre ?? '...'}</div>
                                <button className={styles.pencil} onClick={() => setRenameOpen(true)} aria-label="Renombrar">
                                    <IcPencil />
                                </button>
                            </div>
                            <Button variant="warm" size="md" icon={<IcSwap />} onClick={() => setCollectionOpen(true)} aria-label="Cambiar Tokagotchi">
                                Cambiar
                            </Button>
                        </div>
                        <div className={styles.sub}>
                            <RarityCard rarity={tokagotchi?.rareza} />
                            <div>|</div>
                            <Label key={'Especie-Tokagotchi'} variant={'warm'} look="soft" size="sm">{tokagotchi?.especie ?? ''}</Label>
                        </div>
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

                <div style={{ height: 16 }} />
            </CareSheet>

            {/* Toast */}
            {toast && <Toast {...toast} />}

            {/* Modals */}
            {renameOpen && tokagotchi && (
                <RenameModal
                    currentName={tokagotchi.nombre}
                    onSave={renameToka}
                    onClose={() => setRenameOpen(false)}
                />
            )}
            {perfileOpen && (
                <PerfileModal
                    onClose={() => setPerfileOpen(false)}
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
