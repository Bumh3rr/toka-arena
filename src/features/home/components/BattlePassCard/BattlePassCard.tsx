import { type CSSProperties } from 'react'
import { IcPase } from '@/shared/ui/Icons/Icons'
import styles from './BattlePassCard.module.css'

type BattlePassSide = 'left' | 'right'
type BattlePassPlan = 'premium' | 'free'

interface BattlePassCardProps {
  tier?: number
  season?: string
  side?: BattlePassSide
  plan?: BattlePassPlan
  top?: number
  onClick?: () => void
}

function WaveCrest({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 4 C 6 0, 6 0, 12 4 S 18 8, 24 4 S 30 0, 36 4 S 42 8, 48 4 V12 H0 Z" />
    </svg>
  )
}

export default function BattlePassCard({
  tier = 1,
  season = 'T1',
  side = 'right',
  plan = 'free',
  top = 88,
  onClick,
}: BattlePassCardProps) {
  const pct = Math.max(0, Math.min(100, tier))

  return (
    <div
      className={`${styles.card} ${styles[side]} ${styles[plan]} ${pct > 0 ? styles.filled : ''}`}
      style={{ '--bp-top': `${top}px`, '--tier-pct': `${pct}%` } as CSSProperties}
      onClick={onClick}
      role="button"
      aria-label={`Pase de Batalla ${plan === 'premium' ? 'Premium' : 'Free'} ${season}, nivel ${tier}`}
    >
      <div className={styles.water} aria-hidden="true">
        {/* Superficie: dos crestas sinusoidales en parallax */}
        <div className={styles.surface}>
          <WaveCrest className={styles.waveBack} />
        </div>

        {/* Cuerpo de agua sólido por debajo de las crestas */}
        <div className={styles.body} />

        {/* Línea de flotación luminosa que "respira" sobre la cresta */}
        <span className={styles.gloss} />

        {/* Burbujas: 3 puntos que ascienden lentos y se desvanecen */}
        <span className={styles.bubbles}>
          <i className={styles.bubble} />
          <i className={styles.bubble} />
          <i className={styles.bubble} />
        </span>
      </div>

      {/* Brillo cristalino estático que da volumen al "vidrio" de la card */}
      <div className={styles.gloss2} aria-hidden="true" />

      {/* ── Contenido (siempre por encima del agua) ── */}
      <div className={styles.iconWrap}>
        <IcPase />
      </div>
      <span className={styles.label}>Pase</span>
      <span className={styles.tier}>{season}</span>
    </div>
  )
}
