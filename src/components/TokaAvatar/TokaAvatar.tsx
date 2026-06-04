// src/components/TokaAvatar/TokaAvatar.tsx
import type { Tokagotchi } from '../../types/tokagotchi'
import { RAR } from '../../types/tokagotchi'
import styles from './TokaAvatar.module.css'

interface TokaAvatarProps {
  tokagotchi: Tokagotchi
  size?: number
  isActive?: boolean
}

export default function TokaAvatar({ tokagotchi, size = 54, isActive = false }: TokaAvatarProps) {
  const imgSrc = `/assets/tokagotchis/${tokagotchi.especie}.png`
  const rar = RAR[tokagotchi.rareza]
  return (
    <div
      className={`${styles.wrap} ${isActive ? styles.active : ''}`}
      style={{
        width: size,
        height: size,
        '--ring': rar.ring,
        '--ring-soft': rar.soft,
      } as React.CSSProperties}
    >
      <div className={styles.av} style={{ width: size, height: size, borderColor: rar.ring }}>
        <img src={imgSrc} alt={tokagotchi.nombre} />
      </div>
      {tokagotchi.accesorios.cabeza && (
        <span className={styles.accBadge}>
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path d="M3.4 17l-1.1-8.2 4.9 3.5L12 6l4.8 6.3 4.9-3.5L20.6 17z"
              fill="#F4B731" stroke="#4A2800" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {isActive && (
        <span className={styles.activeGlow}
          style={{ boxShadow: `0 0 0 5px ${rar.soft}` }}
        />
      )}
    </div>
  )
}
