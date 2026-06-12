import { getImagenSrcByEspecie } from '../../services/tokagotchiService'
import type { Tokagotchi } from '../../types/tokagotchi'
import { RAR } from '../../types/tokagotchi'
import styles from './TokaAvatar.module.css'

interface TokaAvatarProps {
  tokagotchi: Tokagotchi
  size?: number
  isActive?: boolean
}

export default function TokaAvatar({ tokagotchi, size = 54, isActive = false }: TokaAvatarProps) {
  const imgSrc = getImagenSrcByEspecie(tokagotchi.species)
  const rar = RAR[tokagotchi.rarity]
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
        <img src={imgSrc} alt={tokagotchi.name} />
      </div>
    </div>
  )
}
