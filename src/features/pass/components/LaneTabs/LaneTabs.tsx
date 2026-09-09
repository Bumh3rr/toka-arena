import styles from "./LaneTabs.module.css";

/** Cabeceras de carril del pase: GRATIS (izquierda) y PREMIUM (derecha). */
export default function LaneTabs() {
  return (
    <div className={styles.tabs} role="presentation">
      <div className={`${styles.tab} ${styles.free}`}>Gratis</div>
      <div className={`${styles.tab} ${styles.premium}`}>Premium</div>
    </div>
  );
}
