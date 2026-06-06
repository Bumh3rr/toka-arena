import { IcX } from '../Icons/Icons'
import styles from './BottomSheet.module.css'

interface BottomSheetProps {
  title: string
  sub?: string
  onClose: () => void
  children: React.ReactNode
}

export default function BottomSheet({ title, sub, onClose, children }: BottomSheetProps) {
  return (
    <div className={styles.modal}>
      <div className={styles.scrim} onClick={onClose} />
      <div className={styles.card}>
        <div className={styles.grab} />
        <div className={styles.head}>
          <span className={styles.title}>
            {title}
            {sub && <small className={styles.sub}>{sub}</small>}
          </span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <IcX />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
