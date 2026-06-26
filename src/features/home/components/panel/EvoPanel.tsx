import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { IcCrown, IcLock, IcClock } from '@/shared/ui/Icons/Icons'
import styles from './styles/EvoPanel.module.css'
import { HeaderTitleLine } from '../CareSheet/CareSheet'
import type { Evolution } from '@/shared/domain/tokagotchi'
import { NEXT_RARITY_META } from '@/shared/constants/rarity'

interface EvoPanelProps {
  nextEvolution: Evolution
  cp: number
  tf: number
  serverTime: number
  onAscend: () => Promise<'SUCCESS' | 'FAIL' | null>
}

const pad = (n: number) => String(n).padStart(2, '0')
const fmtCountdown = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

// ─────────────────────────────────────────────────────────────
// Hook: Maneja el cooldown timer
// ─────────────────────────────────────────────────────────────
function useCooldownTimer(availableAt: number | null, serverTime: number) {
  const [cooldownLeftMs, setCooldownLeftMs] = useState(() =>
    availableAt != null ? Math.max(0, availableAt - serverTime) : 0
  )
  const offsetRef = useRef(0)

  useEffect(() => {
    offsetRef.current = Date.now() - serverTime
    const computeMs = () =>
      availableAt != null
        ? Math.max(0, availableAt - (Date.now() - offsetRef.current))
        : 0

    const initId = setTimeout(() => setCooldownLeftMs(computeMs()), 0)
    if (availableAt == null) return () => clearTimeout(initId)

    const id = setInterval(() => {
      const ms = computeMs()
      setCooldownLeftMs(ms)
      if (ms <= 0) clearInterval(id)
    }, 1000)

    return () => {
      clearTimeout(initId)
      clearInterval(id)
    }
  }, [availableAt, serverTime])

  return cooldownLeftMs
}

// ─────────────────────────────────────────────────────────────
// Sub-component: Flash effect (SUCCESS / FAIL)
// ─────────────────────────────────────────────────────────────
const EvoFlash = memo(({ flash }: { flash: 'SUCCESS' | 'FAIL' | null }) => {
  if (!flash) return null
  return (
    <div
      className={`${styles.fx} ${flash === 'SUCCESS' ? styles.fxSuccess : styles.fxFail}`}
      aria-hidden="true"
    >
      <div className={styles.fxIcon}>{flash === 'SUCCESS' ? <IcCrown /> : <IcLock />}</div>
      <div className={styles.fxText}>
        {flash === 'SUCCESS' ? '¡Evolución exitosa!' : 'La evolución falló'}
      </div>
    </div>
  )
})
EvoFlash.displayName = 'EvoFlash'

// ─────────────────────────────────────────────────────────────
// Sub-component: Rareza máxima
// ─────────────────────────────────────────────────────────────
const MaxedEvo = memo(() => (
  <div className={styles.evoTop}>
    <div className={styles.evoCrown}><IcCrown /></div>
    <div className={styles.evoTitles}>
      <div className={styles.k}>Evolución</div>
      <div className={styles.t}>¡Nivel máximo alcanzado!</div>
    </div>
  </div>
))
MaxedEvo.displayName = 'MaxedEvo'

// ─────────────────────────────────────────────────────────────
// Sub-component: Barra de progreso CP
// ─────────────────────────────────────────────────────────────
const CpProgressBar = memo(({ cp, required }: { cp: number; required: number }) => {
  const pct = Math.min(100, Math.round((cp / required) * 100))
  return (
    <div className={styles.cpbarWrap}>
      <div className={styles.cpbarTop}>
        <span className={styles.cpLabel}>Puntos de Crianza</span>
        <span className={styles.cpVal}>
          <b>{cp}</b> / {required} <img src="/assets/ui/cp/cp_stars.png" alt="CP" className={styles.iconCp} />
        </span>
      </div>
      <div className={styles.cpbar}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
        <span className={styles.pctLabel}>{pct}%</span>
      </div>
    </div>
  )
})
CpProgressBar.displayName = 'CpProgressBar'

// ─────────────────────────────────────────────────────────────
// Sub-component: Atributos del intento
// ─────────────────────────────────────────────────────────────
const EvoAttributes = memo(
  ({ evo }: { evo: Evolution }) => (
    <div className={styles.attrs}>
      <div className={styles.attr}>
        <span className={styles.attrK}>Costo</span>
        <span className={styles.attrV}>
          <img src="/assets/ui/tf/tf.svg" alt="TF" width={15} height={15} />
          {evo.tfRequired}
        </span>
      </div>
      <div className={styles.attr}>
        <span className={styles.attrK}>Éxito</span>
        <span className={styles.attrV}>{evo.successChance}%</span>
      </div>
      <div className={styles.attr}>
        <span className={styles.attrK}>Si falla</span>
        <span className={styles.attrV}>{evo.failCooldownHours}h</span>
      </div>
    </div>
  )
)
EvoAttributes.displayName = 'EvoAttributes'

// ─────────────────────────────────────────────────────────────
// Sub-component: Botón de acción (única parte que re-renderiza cada segundo)
// ─────────────────────────────────────────────────────────────
interface EvoActionButtonProps {
  pending: boolean
  onCooldown: boolean
  enoughCp: boolean
  enoughTf: boolean
  cooldownLeftMs: number
  missingCp: number
  missingTf: number
  onAscend: () => void
}

const EvoActionButton = memo(
  ({ pending, onCooldown, enoughCp, enoughTf, cooldownLeftMs, missingCp, missingTf, onAscend }: EvoActionButtonProps) => {
    if (pending) {
      return <div className={`${styles.evoBtn} ${styles.evoBtnPending}`}>Ascendiendo…</div>
    }
    if (onCooldown) {
      return (
        <div className={`${styles.evoBtn} ${styles.evoBtnCooldown}`}>
          <span className={styles.lockIcon}><IcClock /></span>
          Reintenta en {fmtCountdown(cooldownLeftMs)}
        </div>
      )
    }
    if (!enoughCp) {
      return (
        <div className={styles.evoBtn}>
          <span className={styles.lockIcon}><IcLock /></span>
          Faltan {missingCp} <img src="/assets/ui/cp/cp.png" alt="CP" className={`${styles.iconEnough} ${styles.iconLock}`} />
        </div>
      )
    }
    if (!enoughTf) {
      return (
        <div className={styles.evoBtn}>
          <span className={styles.lockIcon}><IcLock /></span>
          Faltan {missingTf} <img src="/assets/ui/tf/tf.svg" alt="TF" className={`${styles.iconEnough} ${styles.iconLock}`} />
        </div>
      )
    }
    return (
      <button className={`${styles.evoBtn} ${styles.evoBtnUnlocked}`} onClick={onAscend}>
        ¡Ascender ahora!
      </button>
    )
  }
)
EvoActionButton.displayName = 'EvoActionButton'

// ─────────────────────────────────────────────────────────────
// Sub-component: Panel de evolución disponible
// ─────────────────────────────────────────────────────────────
interface EvoAvailableProps {
  evo: Evolution
  cp: number
  tf: number
  pending: boolean
  cooldownLeftMs: number
  onAscend: () => void
}

const EvoAvailable = memo(({ evo, cp, tf, pending, cooldownLeftMs, onAscend }: EvoAvailableProps) => {
  const enoughCp = cp >= evo.cpRequired
  const enoughTf = tf >= evo.tfRequired
  const onCooldown = cooldownLeftMs > 0
  const missingCp = Math.max(0, evo.cpRequired - cp)
  const missingTf = Math.max(0, evo.tfRequired - tf)

  return (
    <>
      <div className={styles.evoTop}>
        <div className={styles.evoCrown}><IcCrown /></div>
        <div className={styles.evoTitles}>
          <div className={styles.k}>Evolución</div>
          <div className={styles.t}>Ascender a {NEXT_RARITY_META[evo.nextRarity].label}</div>
        </div>
      </div>

      <CpProgressBar cp={cp} required={evo.cpRequired} />
      <EvoAttributes evo={evo} />

      <EvoActionButton
        pending={pending}
        onCooldown={onCooldown}
        enoughCp={enoughCp}
        enoughTf={enoughTf}
        cooldownLeftMs={cooldownLeftMs}
        missingCp={missingCp}
        missingTf={missingTf}
        onAscend={onAscend}
      />
    </>
  )
})
EvoAvailable.displayName = 'EvoAvailable'

// ─────────────────────────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────────────────────────
export default function EvoPanel({ nextEvolution, cp, tf, serverTime, onAscend }: EvoPanelProps) {

  const [pending, setPending] = useState(false)
  const [flash, setFlash] = useState<'SUCCESS' | 'FAIL' | null>(null)

  const availableAt = nextEvolution?.evolvedAvailableAt ?? null
  const cooldownLeftMs = useCooldownTimer(availableAt, serverTime)

  // Ready calculado con memoization
  const ready = useMemo(() => {
    if (!nextEvolution) return false
    const enoughCp = cp >= nextEvolution.cpRequired
    const enoughTf = tf >= nextEvolution.tfRequired
    const onCooldown = cooldownLeftMs > 0
    return enoughCp && enoughTf && !onCooldown && !pending
  }, [nextEvolution, cp, tf, cooldownLeftMs, pending])

  const handleAscend = useCallback(async () => {
    if (pending) return
    setPending(true)
    const result = await onAscend()
    setPending(false)
    if (result) {
      setFlash(result)
      window.setTimeout(() => setFlash(null), result === 'SUCCESS' ? 2200 : 700)
    }
  }, [pending, onAscend])

  return (
    <div>
      <HeaderTitleLine title="Evolución" />

      <div
        className={`${styles.evo} ${!nextEvolution ? styles.maxed : ''} ${ready ? styles.ready : ''} ${flash === 'FAIL' ? styles.shake : ''}`}
      >
        <EvoFlash flash={flash} />

        {nextEvolution.nextRarity === 'MAX' ? (
          <MaxedEvo />
        ) : (
          <EvoAvailable
            evo={nextEvolution}
            cp={cp}
            tf={tf}
            pending={pending}
            cooldownLeftMs={cooldownLeftMs}
            onAscend={handleAscend}
          />
        )}
      </div>
    </div>
  )
}