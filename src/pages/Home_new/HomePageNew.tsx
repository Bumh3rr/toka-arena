// src/pages/Home_new/HomePageNew.tsx
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
import TofuCanvas from '../../components/TofuCanvas/TofuCanvas'
import { IcCrown, IcSwap, IcPencil } from '../../components/Icons/Icons'
import { rarityData } from '../../types/tokagotchi'
import type { MisionResponse } from '../../services/userService'
import styles from './HomePageNew.module.css'
import { SCENE_MAX } from '../../components/CareSheet/CareSheet'

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

  // TODO: replace with real claim endpoint when available
  const handleClaim = (id: number) => {
    console.log('Reclamar misión', id)
  }

  const rar = tokagotchi ? rarityData(tokagotchi.rareza) : null

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
        {rar && (
          <div className={styles.rarityBadge} style={{
            background: `linear-gradient(180deg, rgba(255,255,255,.32), rgba(0,0,0,.06)), ${rar.ring}`,
            boxShadow: `inset 0 2px 0 rgba(255,255,255,.4), 0 3px 0 ${rar.ring}`
          }}>
            <span className={styles.star}>★</span>{rar.label}
          </div>
        )}

        <div className={styles.charShadow} />
        <div className={`${styles.crown} ${styles.crownFloat}`}>
          <IcCrown />
        </div>

        {tokagotchi ? (
          <div className={styles.heroChar}>
            <TofuCanvas tokagotchi={tokagotchi} animacion="idle" width={260} height={260} scale={0.5} />
          </div>
        ) : (
          <div className={styles.heroChar}>
            <img
              src={`/assets/tokagotchis/tofu.png`}
              alt="Tokagotchi"
              className={styles.fallbackImg}
            />
          </div>
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

        {/* Evolution */}
        {tokagotchi && (
          <EvoPanel rareza={tokagotchi.rareza} cp={cp} tf={tf} />
        )}

        {/* Care actions */}
        <CareRow cooldowns={cooldowns} floaters={floaters} onUse={ejecutarAccion} />

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
