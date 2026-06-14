import { useState } from 'react'
import { IcCrown, IcLock } from '@/shared/ui/Icons/Icons'
import styles from './styles/EvoPanel.module.css'
import { HeaderTitleLine } from '../CareSheet/CareSheet'
import type { Evolution } from '@/shared/types/evolution'
import { RARITY_META } from '@/shared/constants/rarity'

interface EvoPanelProps {
  evolution: Evolution | null
  cp: number
  tf: number
  onAscend: () => Promise<"SUCCESS" | "FAIL" | null>
}

export default function EvoPanel({ evolution, cp, tf, onAscend }: EvoPanelProps) {
  const [showHelp, setShowHelp] = useState(false)
  const [pending, setPending] = useState(false)

  if (!evolution) {
    return (
      <div>
        <HeaderTitleLine title="Evolución" />
        <div className={`${styles.evo} ${styles.maxed}`}>
          <div className={styles.evoTop}>
            <div className={styles.evoCrown}><IcCrown /></div>
            <div className={styles.evoTitles}>
              <div className={styles.k}>Evolución</div>
              <div className={styles.t}>¡Nivel máximo alcanzado! ✨</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const pct = Math.min(100, Math.round(cp / evolution.cpRequired * 100))
  const onCooldown = evolution.availableAt != null && evolution.availableAt > Date.now()
  const ready = cp >= evolution.cpRequired && tf >= evolution.costTF && !onCooldown && !pending
  const nextRarity = RARITY_META[evolution.nextRarity].label

  const handleAscend = async () => {
    setPending(true)
    try { await onAscend() } finally { setPending(false) }
  }

  return (
    <div>
      <HeaderTitleLine title="Evolución" />
      <div className={`${styles.evo} ${ready ? styles.ready : ''}`}>
        <div className={styles.evoTop}>
          <div className={styles.evoCrown}><IcCrown /></div>
          <div className={styles.evoTitles}>
            <div className={styles.k}>Evolución</div>
            <div className={styles.t}>Ascender a {nextRarity}</div>
          </div>
          <button className={styles.helpBtn} aria-label="Detalles" onClick={() => setShowHelp(s => !s)}>?</button>
          {showHelp && (
            <div className={styles.pop}>
              <div className={styles.popHeader}>Detalles de ascensión</div>
              <div className={styles.popRow}>
                <span>Probabilidad de éxito</span><b>{evolution.successChance}%</b>
              </div>
              <div className={styles.popRow}>
                <span>Si falla</span><b>Espera {evolution.failCooldownHours} h</b>
              </div>
            </div>
          )}
        </div>

        <div className={styles.cpbarWrap}>
          <div className={styles.cpbarTop}>
            <span className={styles.cpLabel}>Puntos de Cuidado</span>
            <span className={styles.cpVal}><b>{cp}</b> / {evolution.cpRequired} CP</span>
          </div>
          <div className={styles.cpbar}>
            <div className={styles.fill} style={{ width: `${pct}%` }} />
            <span className={styles.pctLabel}>{pct}%</span>
          </div>
        </div>

        <div className={styles.evoCost}>
          <span className={styles.costLabel}>Costo de ascensión</span>
          <span className={styles.costAmt}>
            <img src="/assets/ui/moneda_tf.svg" alt="TF" width={17} height={17} />
            {evolution.costTF} TF
          </span>
        </div>

        {pending ? (
          <div className={`${styles.evoBtn} ${styles.evoBtnUnlocked}`} style={{ cursor: 'default' }}>
            ¡{nextRarity} alcanzado! ✨
          </div>
        ) : ready ? (
          <button className={`${styles.evoBtn} ${styles.evoBtnUnlocked}`} onClick={handleAscend}>
            ¡Ascender ahora!
          </button>
        ) : (
          <div className={styles.evoBtn}>
            <span className={styles.lockIcon}><IcLock /></span>
            Faltan {Math.max(0, evolution.cpRequired - cp)} CP
          </div>
        )}
      </div>
    </div>

  )
}
