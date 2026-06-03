// src/components/MissionFab/MissionFab.tsx
import { IcMissions } from '../Icons/Icons'
import styles from './MissionFab.module.css'

interface MissionFabProps {
  onOpen: () => void
  badge?: number
  lifted?: boolean
}

export default function MissionFab({ onOpen, badge = 0, lifted = false }: MissionFabProps) {
  return (
    <button
      className={`${styles.fab} ${lifted ? styles.lifted : ''}`}
      onClick={onOpen}
      aria-label="Misiones del día"
    >
      <span className={styles.disc}>
        <IcMissions />
        {badge > 0 && <span className={styles.notif}>{badge}</span>}
      </span>
      <span className={styles.cap}>Misiones</span>
    </button>
  )
}
