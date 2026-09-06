import { useState } from 'react'
import { IconButton, Label, Toast } from '@/shared/ui/Kit'
import { IcPerson, IcClock, IcClothes } from '@/shared/ui/Icons/Icons'
import { CoinPillCard } from '@/shared/ui/Cards/CoinPillCard/CoinPillCard'
import SheetPanel from '@/shared/ui/Sheet/SheetPanel/SheetPanel'
import CollectionModal from '@/shared/ui/modal/CollectionModal/CollectionModal'
import Loading from '@/shared/ui/Loading/Loading'
import PageError from '@/shared/ui/Error/Error'
import PerfileModal from '@/features/auth/components/PerfileModal'
import { useToast } from '@/shared/hooks/useToast'

import ArenaStage from '../../components/ArenaStage/ArenaStage'
import StaminaCard from '../../components/StaminaCard/StaminaCard'
import RecordCard from '../../components/RecordCard/RecordCard'
import PotionTray from '../../components/PotionTray/PotionTray'
import NoStaminaBanner from '../../components/NoStaminaBanner/NoStaminaBanner'
import LobbyActionBar from '../../components/LobbyActionBar/LobbyActionBar'
import ModePanel from '../../components/panels/ModePanel/ModePanel'
import TokaPanel from '../../components/panels/TokaPanel/TokaPanel'
import PanelPlaceholder from '../../components/panels/PanelPlaceholder/PanelPlaceholder'
import ArenaBackdrop from '../../components/ArenaBackdrop/ArenaBackdrop'
import { useArenaLobby } from '../../hooks/useArenaLobby'
import { useArenaPanel } from '../../hooks/useArenaPanel'
import type { ArenaMode } from '../../types/arena.types'
import styles from './LobbySection.module.css'

/** Px de la parte superior que el cajón deja al descubierto. */
const PANEL_TOP_OFFSET = 150

interface LobbySectionProps {
  mode: ArenaMode
  onModeChange: (mode: ArenaMode) => void
  /** Entrar a la cola: lo resuelve `ArenaPage` cambiando de fase. */
  onSearchRival: () => void
}

/**
 * Lobby de arena.
 *
 * Es la primera de las cinco secciones del módulo: el jugador ve a su
 * tokagotchi en el ruedo, revisa estamina e historial, elige modo y pociones,
 * y entra a combate.
 */
export default function LobbySection({
  mode,
  onModeChange,
  onSearchRival,
}: LobbySectionProps) {
  const { state, reload } = useArenaLobby(mode)
  const { panel, open, expanded, setExpanded } = useArenaPanel()
  const { toast, show } = useToast()

  const [profileOpen, setProfileOpen] = useState(false)
  const [collectionOpen, setCollectionOpen] = useState(false)

  if (state.status === 'loading') return <Loading fullscreen text="Preparando la arena..." />
  if (state.status === 'error') return <PageError message={state.error} onRetry={reload} />
  if (state.status === 'empty') {
    return <PageError message="Necesitas un Tokagotchi para entrar a la arena." onRetry={reload} />
  }

  const { player, arena, theme, hasStamina, canBattle } = state.data

  // El panel se queda abierto detrás del modal: al cerrarlo el jugador vuelve
  // donde estaba, ya con el tokagotchi nuevo (la caché 'player' se revalida).
  const handleChangeToka = () => setCollectionOpen(true)

  const handleRefill = () => show('Recarga de estamina — próximamente', { variant: 'info' })

  return (
    <section className={styles.section}>
      <ArenaBackdrop mode={mode} />

      {/* Perfil y saldo */}
      <header className={styles.topbar}>
        <div className={styles.user}>
          <IconButton
            variant="legend"
            size={50}
            shape="round"
            onClick={() => setProfileOpen(true)}
            ariaLabel="Perfil"
          >
            <IcPerson />
          </IconButton>
          <Label variant="warm" look="soft" size="sm">{player.username}</Label>
        </div>
        <CoinPillCard tf={player.tf} />
      </header>

      {/* Estamina e historial, anclados a los bordes */}
      <div className={styles.edgeRow}>
        <StaminaCard stamina={arena.stamina} />
        <RecordCard record={arena.record} onOpenHistory={() => open('history')} />
      </div>

      <ArenaStage
        theme={theme}
        tokagotchi={player.tokagotchi}
        paused={expanded}
        onOpenToka={() => open('toka')}
      />

      {/* Controles */}
      <footer className={`${styles.controls} ${expanded ? styles.controlsHidden : ''}`}>
        <div className={styles.trayRow}>
          <PotionTray slots={arena.potions} onOpen={() => open('potions')} />
        </div>

        {!hasStamina && (
          <NoStaminaBanner stamina={arena.stamina} onRefill={handleRefill} />
        )}

        <LobbyActionBar
          theme={theme}
          hasStamina={hasStamina}
          canBattle={canBattle}
          onChangeToka={handleChangeToka}
          onOpenMode={() => open('mode')}
          onBattle={onSearchRival}
        />
      </footer>

      {/* Cajón compartido por los cuatro paneles */}
      <SheetPanel
        expanded={expanded}
        onExpandedChange={setExpanded}
        topOffset={PANEL_TOP_OFFSET}
      >
        {panel === 'toka' && (
          <TokaPanel tokagotchi={player.tokagotchi} onChangeToka={handleChangeToka} />
        )}
        {panel === 'mode' && (
          <ModePanel selected={mode} onSelect={onModeChange} />
        )}
        {panel === 'potions' && (
          <PanelPlaceholder
            title="Pociones"
            description="Aquí vas a equipar las tres pociones que tu Tokagotchi lleva al combate."
            icon={<IcClothes />}
          />
        )}
        {panel === 'history' && (
          <PanelPlaceholder
            title="Historial"
            description="Aquí vas a revisar tus combates anteriores, rival por rival."
            icon={<IcClock />}
          />
        )}
      </SheetPanel>

      {toast && <Toast {...toast} />}

      {profileOpen && <PerfileModal onClose={() => setProfileOpen(false)} />}
      {collectionOpen && <CollectionModal onClose={() => setCollectionOpen(false)} />}
    </section>
  )
}
