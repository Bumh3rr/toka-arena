import { ProgressBar } from "@/shared/ui/Kit";
import styles from "./PassProgress.module.css";

interface PassProgressProps {
  level: number;
  xpCurrent: number;
  xpMax: number;
}

export default function PassProgress({ level, xpCurrent, xpMax }: PassProgressProps) {
  const pct = xpMax > 0 ? Math.min(100, Math.round((xpCurrent / xpMax) * 100)) : 0;

  return (
    <div className={styles.row}>
      <div className={styles.badge}>
        <span className={styles.badgeCap}>NIV</span>
        <span className={styles.badgeLevel}>{level}</span>
      </div>

      <div className={styles.progress}>
        <ProgressBar
          pct={pct}
          height={16}
          color="linear-gradient(180deg,#8AD86A,var(--green))"
        />
        <div className={styles.labels}>
          <span className={styles.xp}>
            {xpCurrent} / {xpMax} XP
          </span>
          <span className={styles.next}>Nivel {level + 1}</span>
        </div>
      </div>
    </div>
  );
}
