// src/components/Home/EvoPanel.tsx
import { useState } from 'react'
import { IcCrown, IcLock } from '../Utils/Icons/Icons'
import type { Rareza } from '../../types/tokagotchi'
import { EVOLUCION } from '../../constants/evolucion'
import styles from './EvoPanel.module.css'
import { HeaderTitleLine } from '../CareSheet/CareSheet'

interface EvoPanelProps {
  rareza: Rareza
  cp: number
  tf: number
}

export default function EvoPanel({ rareza, cp, tf }: EvoPanelProps) {
  const [showHelp, setShowHelp] = useState(false)
  const [ascended, setAscended] = useState(false)

  const regla = EVOLUCION[rareza]

  if (!regla) {
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

  const pct = Math.min(100, Math.round(cp / regla.cpMeta * 100))
  const ready = cp >= regla.cpMeta && !ascended && tf >= regla.costoTF

  const handleAscend = () => {
    // TODO: call ascension endpoint when available
    setAscended(true)
  }

  return (
    <div>
      <HeaderTitleLine title="Evolución" />
      <div className={`${styles.evo} ${ready ? styles.ready : ''}`}>
        <div className={styles.evoTop}>
          <div className={styles.evoCrown}><IcCrown /></div>
          <div className={styles.evoTitles}>
            <div className={styles.k}>Evolución</div>
            <div className={styles.t}>Ascender a {regla.siguiente}</div>
          </div>
          <button className={styles.helpBtn} aria-label="Detalles" onClick={() => setShowHelp(s => !s)}>?</button>
          {showHelp && (
            <div className={styles.pop}>
              <div className={styles.popHeader}>Detalles de ascensión</div>
              <div className={styles.popRow}>
                <span>Probabilidad de éxito</span><b>{regla.probabilidadPct}%</b>
              </div>
              <div className={styles.popRow}>
                <span>Si falla</span><b>Espera {regla.cooldownHoras} h</b>
              </div>
            </div>
          )}
        </div>

        <div className={styles.cpbarWrap}>
          <div className={styles.cpbarTop}>
            <span className={styles.cpLabel}>Puntos de Cuidado</span>
            <span className={styles.cpVal}><b>{cp}</b> / {regla.cpMeta} CP</span>
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
            {regla.costoTF} TF
          </span>
        </div>

        {ascended ? (
          <div className={`${styles.evoBtn} ${styles.evoBtnUnlocked}`} style={{ cursor: 'default' }}>
            ¡{regla.siguiente} alcanzado! ✨
          </div>
        ) : ready ? (
          <button className={`${styles.evoBtn} ${styles.evoBtnUnlocked}`} onClick={handleAscend}>
            ¡Ascender ahora!
          </button>
        ) : (
          <div className={styles.evoBtn}>
            <span className={styles.lockIcon}><IcLock /></span>
            Faltan {Math.max(0, regla.cpMeta - cp)} CP
          </div>
        )}
      </div>
    </div>

  )
}
