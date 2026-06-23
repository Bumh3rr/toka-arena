import { useState, useEffect } from 'react'
import { IcCrown, IcLock, IcClock } from '@/shared/ui/Icons/Icons'
import styles from './styles/EvoPanel.module.css'
import { HeaderTitleLine } from '../CareSheet/CareSheet'
import type { Evolution } from '@/shared/domain/evolution'
import { RARITY_META } from '@/shared/constants/rarity'

interface EvoPanelProps {
  nextEvolution: Evolution | null
  cp: number
  tf: number
  serverTime: number
  onAscend: () => Promise<'SUCCESS' | 'FAIL' | null>
}

const pad = (n: number) => String(n).padStart(2, '0')
/** ms → "HH:MM:SS" (cuenta regresiva del cooldown de reintento) */
const fmtCountdown = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

export default function EvoPanel({ nextEvolution, cp, tf, serverTime, onAscend }: EvoPanelProps) {
  const [pending, setPending] = useState(false)
  const [flash, setFlash] = useState<'SUCCESS' | 'FAIL' | null>(null)
  const [, tick] = useState(0)

  const availableAt = nextEvolution?.evolvedAvailableAt ?? null

  // Cuenta regresiva: fuerza un re-render por segundo mientras el cooldown siga activo.
  useEffect(() => {
    if (availableAt == null) return
    const offset = Date.now() - serverTime
    const id = setInterval(() => {
      tick((n) => n + 1)
      const now = Date.now() - offset // Simula tiempo del servidor
      if (now >= availableAt) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [availableAt, serverTime])

  const handleAscend = async () => {
    if (pending) return
    setPending(true)
    const result = await onAscend()
    setPending(false)
    if (result) {
      setFlash(result)
      window.setTimeout(() => setFlash(null), result === 'SUCCESS' ? 2200 : 700)
    }
  }

  const cooldownLeftMs = availableAt != null ? Math.max(0, availableAt - serverTime) : 0
  const onCooldown = cooldownLeftMs > 0
  const enoughCp = !!nextEvolution && cp >= nextEvolution.cpRequired
  const enoughTf = !!nextEvolution && tf >= nextEvolution.costTF
  const ready = !!nextEvolution && enoughCp && enoughTf && !onCooldown && !pending

  const pct = nextEvolution
    ? Math.min(100, Math.round((cp / nextEvolution.cpRequired) * 100))
    : 100

  return (
    <div>
      <HeaderTitleLine title="Evolución" />

      <div
        className={`${styles.evo} ${!nextEvolution ? styles.maxed : ''} ${ready ? styles.ready : ''} ${flash === 'FAIL' ? styles.shake : ''}`}
      >
        {/* FX de resultado (éxito / fallo) */}
        {flash && (
          <div
            className={`${styles.fx} ${flash === 'SUCCESS' ? styles.fxSuccess : styles.fxFail}`}
            aria-hidden="true"
          >
            <div className={styles.fxIcon}>{flash === 'SUCCESS' ? <IcCrown /> : <IcLock />}</div>
            <div className={styles.fxText}>
              {flash === 'SUCCESS' ? '¡Evolución exitosa!' : 'La evolución falló'}
            </div>
          </div>
        )}

        {!nextEvolution ? (
          /* Rareza máxima */
          <div className={styles.evoTop}>
            <div className={styles.evoCrown}><IcCrown /></div>
            <div className={styles.evoTitles}>
              <div className={styles.k}>Evolución</div>
              <div className={styles.t}>¡Nivel máximo alcanzado!</div>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.evoTop}>
              <div className={styles.evoCrown}><IcCrown /></div>
              <div className={styles.evoTitles}>
                <div className={styles.k}>Evolución</div>
                <div className={styles.t}>Ascender a {RARITY_META[nextEvolution.nextRarity].label}</div>
              </div>
            </div>

            {/* Progreso de CP */}
            <div className={styles.cpbarWrap}>
              <div className={styles.cpbarTop}>
                <span className={styles.cpLabel}>Puntos de Cuidado</span>
                <span className={styles.cpVal}><b>{cp}</b> / {nextEvolution.cpRequired} CP</span>
              </div>
              <div className={styles.cpbar}>
                <div className={styles.fill} style={{ width: `${pct}%` }} />
                <span className={styles.pctLabel}>{pct}%</span>
              </div>
            </div>

            {/* Atributos del intento, expuestos de un vistazo */}
            <div className={styles.attrs}>
              <div className={styles.attr}>
                <span className={styles.attrK}>Costo</span>
                <span className={styles.attrV}>
                  <img src="/assets/ui/moneda_tf.svg" alt="TF" width={15} height={15} />{nextEvolution.costTF}
                </span>
              </div>
              <div className={styles.attr}>
                <span className={styles.attrK}>Éxito</span>
                <span className={styles.attrV}>{nextEvolution.successChance}%</span>
              </div>
              <div className={styles.attr}>
                <span className={styles.attrK}>Si falla</span>
                <span className={styles.attrV}>{nextEvolution.failCooldownHours}h</span>
              </div>
            </div>

            {/* Acción / estado del intento */}
            {pending ? (
              <div className={`${styles.evoBtn} ${styles.evoBtnPending}`}>Ascendiendo…</div>
            ) : onCooldown ? (
              <div className={`${styles.evoBtn} ${styles.evoBtnCooldown}`}>
                <span className={styles.lockIcon}><IcClock /></span>
                Reintenta en {fmtCountdown(cooldownLeftMs)}
              </div>
            ) : !enoughCp ? (
              <div className={styles.evoBtn}>
                <span className={styles.lockIcon}><IcLock /></span>
                Faltan {nextEvolution.cpRequired - cp} CP
              </div>
            ) : !enoughTf ? (
              <div className={styles.evoBtn}>
                <span className={styles.lockIcon}><IcLock /></span>
                Faltan {nextEvolution.costTF - tf} TF
              </div>
            ) : (
              <button className={`${styles.evoBtn} ${styles.evoBtnUnlocked}`} onClick={handleAscend}>
                ¡Ascender ahora!
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
