import { IconButton } from '@/shared/ui/Kit'
import { IcMissions } from '@/shared/ui/Icons/Icons'
import styles from './MissionFab.module.css'

interface MissionFabProps {
  onOpen: () => void
  badge?: number
  lifted?: boolean
}

export default function MissionFab({ onOpen, badge = 0}: MissionFabProps) {
  const hasBadge = badge > 0

  return (
    <div className={`${styles.fab}`}>
      <IconButton
        onClick={onOpen}
        size={50}
        variant="warm"
        ariaLabel={hasBadge ? `Misiones del día, ${badge} nuevas` : 'Misiones del día'}
      >
        <IcMissions />
        {hasBadge && (
          <span className={styles.notif} aria-hidden="true">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </IconButton>
      <span className={styles.cap}>Misiones</span>
    </div>
  )
}
