import { useEffect, useMemo, useState } from 'react'
import { Toast } from '@/shared/ui/Kit'
import Loading from '@/shared/ui/Loading/Loading'
import PageError from '@/shared/ui/Error/Error'
import { usePlayer } from '@/shared/player/hooks/usePlayer'
import { useToast } from '@/shared/hooks/useToast'
import { useNavBar } from '@/shared/hooks/useNavBar'
import { getSpeciesImageSrc } from '@/shared/game/assets'
import type { AnimationTokagotchi, Tokagotchi } from '@/shared/domain/tokagotchi'

import ArenaBackdrop from '../../components/ArenaBackdrop/ArenaBackdrop'
import BattleStage from '../../components/battle/BattleStage/BattleStage'
import FighterCard from '../../components/battle/FighterCard/FighterCard'
import BattleLog from '../../components/battle/BattleLog/BattleLog'
import SkillGrid from '../../components/battle/SkillGrid/SkillGrid'
import BattleActionBar from '../../components/battle/BattleActionBar/BattleActionBar'
import PotionSheet from '../../components/battle/PotionSheet/PotionSheet'
import ReconnectOverlay from '../../components/battle/ReconnectOverlay/ReconnectOverlay'
import { useBattle } from '../../hooks/useBattle'
import { createBattleDriver } from '../../lib/battleDriver'
import { useArenaSocket } from '@/shared/ws/arenaSocketContext'
import { getPortrait, portraitKey } from '../../lib/tokaPortrait'
import { movesetOf } from '../../constants/skills'
import { ARENA_MODES } from '../../constants/modes'
import { BATTLE_ANIM, CRITICAL_HP_PCT } from '../../constants/battle'
import type {
  ArenaMode,
  BattleResult,
  MatchFound,
  PotionId,
  ResultKind,
  Skill,
} from '../../types/arena.types'
import styles from './BattleSection.module.css'

interface BattleSectionProps {
  mode: ArenaMode
  match: MatchFound
  /** Abandonar y volver al lobby. */
  onExit: () => void
  /** El combate terminó: lo recoge la sección de resultados. */
  onFinish: (result: BattleResult) => void
}

/**
 * Sección 4: el combate por turnos.
 *
 * Cabe entero en un viewport sin scroll, y para que eso aguante en pantallas
 * cortas **el ruedo es lo único elástico**: las fichas, el relato y los botones
 * tienen alto fijo, así que lo que se encoge es el escenario y nunca
 * desaparece una acción por debajo del borde.
 */
export default function BattleSection({ mode, match, onExit, onFinish }: BattleSectionProps) {
  const { state: playerState, reload } = usePlayer()
  const { hideBar, showBar } = useNavBar()

  useEffect(() => {
    hideBar()
    return () => showBar()
  }, [hideBar, showBar])

  const tokagotchi = playerState.status === 'ready' ? playerState.data.mainTokagotchi : null
  const playerId = playerState.status === 'ready' ? playerState.data.id : null

  if (playerState.status === 'loading') return <Loading fullscreen text="Entrando al ruedo..." />
  if (playerState.status === 'error') {
    return <PageError message={playerState.error} onRetry={reload} />
  }
  if (!tokagotchi || !playerId) {
    return <PageError message="Necesitas un Tokagotchi para pelear." onRetry={onExit} />
  }

  return (
    <Battle
      mode={mode}
      match={match}
      tokagotchi={tokagotchi}
      playerId={playerId}
      startingTf={playerState.data.tf}
      onExit={onExit}
      onFinish={onFinish}
    />
  )
}

/**
 * Cuerpo del combate, ya con un Tokagotchi confirmado.
 *
 * Va aparte para que el driver —que arranca la batalla al crearse— no se monte
 * antes de saber con qué se pelea.
 */
function Battle({
  mode,
  match,
  tokagotchi,
  playerId,
  onExit,
  onFinish,
  startingTf,
}: Omit<BattleSectionProps, 'mode'> & {
  mode: ArenaMode
  tokagotchi: Tokagotchi
  playerId: string
  /** Saldo de TF antes de que el servidor pague las recompensas. */
  startingTf: number
}) {
  const { subscribe, publish, online } = useArenaSocket()
  const { toast, show } = useToast()

  /*
   * Una sola instancia por combate: recrearla volvería a suscribirse y a pedir
   * el estado sin necesidad. La conexión puede ir y venir por debajo sin que
   * el driver cambie.
   */
  const driver = useMemo(
    () =>
      createBattleDriver({
        battleId: match.battleId,
        subscribe,
        publish,
        onDropped: (message) => show(message, { variant: 'danger' }),
      }),
    [match.battleId, subscribe, publish, show],
  )

  const battle = useBattle({ driver, myPlayerId: playerId, online })
  const { me, rival, isMyTurn, acting, flashes } = battle

  /*
   * Saldo de partida. El servidor no manda las recompensas —las aplica sobre
   * el perfil— así que la pantalla de resultados las deduce comparando, y la
   * foto tiene que tomarse antes de que pague. Aquí es el único momento sin
   * ambigüedad: la caché `'player'` no se toca durante el combate.
   */
  const before = useMemo(
    () => ({ tf: startingTf, cp: tokagotchi.cp }),
    [startingTf, tokagotchi.cp],
  )

  const [potionsOpen, setPotionsOpen] = useState(false)
  const [energyPreview, setEnergyPreview] = useState<number | undefined>(undefined)

  // Los errores del servidor llegan como texto plano: son para avisar, no para
  // ramificar lógica. Van a un toast y se limpian solos.
  useEffect(() => {
    if (!battle.error) return
    show(battle.error, { variant: 'danger' })
    battle.clearError()
  }, [battle, show])

  /*
   * El desenlace pasa a la sección de resultados tras un respiro: el último
   * golpe necesita verse antes de que la pantalla cambie.
   */
  useEffect(() => {
    const { outcome, byAbandon, state } = battle
    if (!outcome) return

    const kind: ResultKind = byAbandon && outcome === 'WIN' ? 'ABANDON' : outcome

    const id = window.setTimeout(
      () =>
        onFinish({
          kind,
          turns: state?.currentTurn ?? 1,
          rivalName: match.rival.name,
          before,
        }),
      1200,
    )
    return () => window.clearTimeout(id)
  }, [battle, onFinish, match.rival.name, before])

  if (!me || !rival) return <Loading fullscreen text="Preparando el combate..." />

  const theme = ARENA_MODES[mode]
  const myPortrait =
    getPortrait(portraitKey(tokagotchi.species, tokagotchi.equipped)) ??
    getSpeciesImageSrc(tokagotchi.species)

  const potionsLeft = Object.values(me.potions).reduce<number>((sum, n) => sum + (n ?? 0), 0)
  const criticalHp = (me.currentHp / Math.max(1, me.maxHp)) * 100 <= CRITICAL_HP_PCT

  /*
   * Quién golpea y quién encaja se deduce de a quién le cambió la vida, no de
   * quién tiene el turno: el veneno y la fatiga también restan HP, y ahí no
   * hay atacante que animar.
   */
  const hurt = new Set(flashes.filter((f) => f.delta < 0).map((f) => f.playerId))
  const healed = new Set(flashes.filter((f) => f.delta > 0).map((f) => f.playerId))

  const animationFor = (id: string, opponentId: string): AnimationTokagotchi => {
    if (!acting) return BATTLE_ANIM.idle
    if (healed.has(id)) return BATTLE_ANIM.heal
    if (hurt.has(id)) return BATTLE_ANIM.hurt
    return hurt.has(opponentId) ? BATTLE_ANIM.attack : BATTLE_ANIM.idle
  }

  const handleSkill = (skill: Skill) => {
    setEnergyPreview(undefined)
    battle.send({ type: 'SKILL', skill: skill.id })
  }

  const handlePotion = (potion: PotionId) => {
    setPotionsOpen(false)
    battle.send({ type: 'POTION', potion })
  }

  return (
    <section className={styles.section}>
      <ArenaBackdrop mode={mode} />
      <div className={styles.scrim} aria-hidden="true" />

      {/* La pantalla entera avisa cuando la vida está en rojo */}
      {criticalHp && <div className={styles.vignette} aria-hidden="true" />}

      <div className={styles.content}>
        <FighterCard
          fighter={rival}
          portraitSrc={getSpeciesImageSrc(rival.species)}
          side="rival"
          username={match.rival.username}
          rarity={match.rival.rarity}
          active={!isMyTurn}
          secondsLeft={battle.secondsLeft}
        />

        <BattleStage
          background={theme.background}
          me={me}
          rival={rival}
          myAccessories={tokagotchi.equipped}
          myAnimation={animationFor(me.playerId, rival.playerId)}
          rivalAnimation={animationFor(rival.playerId, me.playerId)}
          currentTurn={battle.state?.currentTurn ?? 1}
          turnLabel={isMyTurn ? 'Tu turno' : `Turno de ${rival.name}...`}
          isMyTurn={isMyTurn}
          flashes={flashes}
        />

        <FighterCard
          fighter={me}
          portraitSrc={myPortrait}
          side="me"
          username="Tú"
          rarity={tokagotchi.rarity}
          active={isMyTurn}
          secondsLeft={battle.secondsLeft}
          energyPreview={energyPreview}
        />

        <BattleLog lines={battle.log} />

        <SkillGrid
          skills={movesetOf(me.species)}
          energy={me.currentEnergy}
          enabled={isMyTurn && !acting}
          onUse={handleSkill}
          onPreview={setEnergyPreview}
        />

        <BattleActionBar
          potionsLeft={potionsLeft}
          enabled={isMyTurn && !acting}
          onOpenPotions={() => setPotionsOpen(true)}
          onRest={() => battle.send({ type: 'REST' })}
        />
      </div>

      {potionsOpen && (
        <PotionSheet
          potions={me.potions}
          enabled={isMyTurn && !acting}
          onUse={handlePotion}
          onClose={() => setPotionsOpen(false)}
        />
      )}

      {!battle.online && <ReconnectOverlay onLeave={onExit} />}

      {toast && <Toast {...toast} />}
    </section>
  )
}
