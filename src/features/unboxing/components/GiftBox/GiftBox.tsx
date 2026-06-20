import styles from './GiftBox.module.css'

interface GiftBoxProps {
  fase: 'idle' | 'shaking' | 'exploding'
  onClick: () => void
}

export default function GiftBox({ fase, onClick }: GiftBoxProps) {
  return (
    <div
      className={`${styles.wrapper} ${styles[fase]}`}
      onClick={fase === 'idle' ? onClick : undefined}
    >
      {/* Destellos alrededor del regalo */}
      {fase === 'shaking' && (
        <>
          <span className={`${styles.spark} ${styles.spark1}`}>✨</span>
          <span className={`${styles.spark} ${styles.spark2}`}>⭐</span>
          <span className={`${styles.spark} ${styles.spark3}`}>✨</span>
          <span className={`${styles.spark} ${styles.spark4}`}>⭐</span>
        </>
      )}

      <img
        src="/assets/ui/huevo.png"
        alt="Regalo"
        className={styles.gift}
        draggable={false}
      />

      {/* Flash blanco al explotar */}
      {fase === 'exploding' && (
        <div className={styles.flash} />
      )}
    </div>
  )
}