import BottomSheet from '../BottomSheet/BottomSheet'
import { IcCheck } from '../Icons/Icons'
import styles from './MissionsModal.module.css'

interface MisionData {
  id: number
  description: string
  percentage: number
  completed: boolean
  rewardTf: number
}

interface MissionsModalProps {
  missions: MisionData[]
  onClaim: (id: number) => void
  onClose: () => void
}

function MissionRow({ m, onClaim }: { m: MisionData; onClaim: (id: number) => void }) {
  const done = m.percentage >= 100
  return (
    <div className={`${styles.mission} ${m.completed ? styles.done : ''}`}>
      <div className={styles.mBody}>
        <div className={styles.mTitle}>{m.description}</div>
        <div className={styles.mTrack}>
          <div className={styles.mFill} style={{ width: `${m.percentage}%` }} />
        </div>
        <div className={styles.mProg}>{m.percentage}%</div>
      </div>
      <div className={styles.mReward}>
        {m.completed ? (
          <span className={styles.claimed}><IcCheck /> Listo</span>
        ) : done ? (
          <button className={styles.claimBtn} onClick={() => onClaim(m.id)}>
            Reclamar
            <img src="/assets/ui/moneda_tf.svg" alt="TF" width={15} height={15} />
            +{m.rewardTf}
          </button>
        ) : (
          <span className={styles.rewardPill}>
            <img src="/assets/ui/moneda_tf.svg" alt="TF" width={15} height={15} />
            +{m.rewardTf} TF
          </span>
        )}
      </div>
    </div>
  )
}

export default function MissionsModal({ missions, onClaim, onClose }: MissionsModalProps) {
  const done = missions.filter(m => m.percentage >= 100).length
  const active = missions.filter(m => !m.completed)
  const completed = missions.filter(m => m.completed)

  return (
    <BottomSheet title="Misiones del día" sub={`(${done}/${missions.length})`} onClose={onClose}>
      <div className={styles.list}>
        {active.map(m => <MissionRow key={m.id} m={m} onClaim={onClaim} />)}
      </div>
      <div className={styles.sub}>Completadas</div>
      {completed.length === 0 ? (
        <div className={styles.empty}>Aún no has reclamado misiones hoy.</div>
      ) : (
        <div className={styles.list}>
          {completed.map(m => <MissionRow key={m.id} m={m} onClaim={onClaim} />)}
        </div>
      )}
    </BottomSheet>
  )
}
