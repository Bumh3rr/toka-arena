import { type CSSProperties } from 'react'
import { IcPase, IcClock } from '@/shared/ui/Icons/Icons'
import styles from './BattlePassCard.module.css'
import { usePass } from '@/features/pass/hooks/usePass'

type BattlePassSide = 'left' | 'right'

interface BattlePassCardProps {
  side?: BattlePassSide
  top?: number
  onClick?: () => void
}

const DAY_MS = 86_400_000

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
  side = 'right',
  top = 90,
  onClick,
}: BattlePassCardProps) {
  const { state, reload } = usePass()
  const cssVars = { '--bp-top': `${top}px` } as CSSProperties

  // ── Loading: skeleton (estilo Facebook) con la misma silueta de pestaña ──
  if (state.status === 'loading') {
    return (
      <div
        className={`${styles.skeleton} ${styles[side]}`}
        style={cssVars}
        aria-busy="true"
        aria-label="Cargando pase de batalla"
      >
        <div className={`${styles.sk} ${styles.skIcon}`} />
        <div className={`${styles.sk} ${styles.skLine}`} />
        <div className={`${styles.sk} ${styles.skPill}`} />
      </div>
    )
  }

  // ── Error: toda la pestaña es táctil y reintenta (reload) ──
  if (state.status === 'error') {
    return (
      <button
        className={`${styles.errorCard} ${styles[side]}`}
        style={cssVars}
        onClick={() => reload()}
        aria-label="Error al cargar el pase. Toca para reintentar"
      >
        <span className={styles.errIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M20 11a8 8 0 1 0-2.2 5.6M20 11V5M20 11h-6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.errText}>Reintentar</span>
      </button>
    )
  }

  const { isPremium, season, tier, totalTiers, endsAt, serverTime } = state.data
  const pct = totalTiers > 0 ? Math.min(100, Math.round((tier / totalTiers) * 100)) : 0
  const daysLeft =
    endsAt != null ? Math.max(0, Math.ceil((endsAt - serverTime) / DAY_MS)) : null

  return (
    <div
      className={`${styles.card} ${styles[side]} ${styles[isPremium ? 'premium' : 'free']} ${pct > 0 ? styles.filled : ''}`}
      style={{ ...cssVars, '--tier-pct': `${pct}%` } as CSSProperties}
      onClick={onClick}
      role="button"
      aria-label={`Pase de Batalla ${isPremium ? 'Premium' : 'Free'} ${season}, nivel ${tier}${daysLeft != null ? `, ${daysLeft} días restantes` : ''}`}
    >
      <div className={styles.water} aria-hidden="true">
        {/* Superficie: cresta sinusoidal en parallax */}
        <div className={styles.surface}>
          <WaveCrest className={styles.waveBack} />
        </div>

        {/* Cuerpo de agua sólido por debajo de la cresta */}
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

      {/* Días restantes para que termine la temporada */}
      {daysLeft != null && (
        <span className={styles.days}>
          <IcClock />
          {daysLeft > 0 ? `${daysLeft}d` : 'Hoy'}
        </span>
      )}
    </div>
  )
}
