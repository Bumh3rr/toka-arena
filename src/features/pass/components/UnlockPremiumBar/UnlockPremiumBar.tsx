import styles from "./UnlockPremiumBar.module.css";

interface UnlockPremiumBarProps {
  price: number;
  summary: string;
  onClick?: () => void;
}

function formatPrice(n: number): string {
  return n.toLocaleString("es-MX").replace(/,/g, " ");
}


export default function UnlockPremiumBar({
  price,
  summary,
  onClick,
}: UnlockPremiumBarProps) {
  return (
    <button className={styles.bar} onClick={onClick} type="button">
      <span className={styles.texts}>
        <span className={styles.title}>Desbloquear Premium</span>
        <span className={styles.summary}>{summary}</span>
      </span>

      <span className={styles.pricePill}>
        <img
          className={styles.coin}
          src="/assets/ui/tf/moneda_tf.png"
          alt="TF"
        />
        <span className={styles.priceValue}>{formatPrice(price)}</span>
      </span>
    </button>
  );
}
