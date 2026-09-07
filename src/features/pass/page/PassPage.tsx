import { CoinPillCard } from "@/shared/ui/Cards/CoinPillCard/CoinPillCard";
import PassProgress from "../components/PassProgress/PassProgress";
import LaneTabs from "../components/LaneTabs/LaneTabs";
import PassTrack from "../components/PassTrack/PassTrack";
import UnlockPremiumBar from "../components/UnlockPremiumBar/UnlockPremiumBar";
import { SEASON_1 } from "../data/season1";
import styles from "./PassPage.module.css";


export default function PassPage() {
  const season = SEASON_1;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headTop}>
          <div className={styles.headTexts}>
            <span className={styles.eyebrow}>{season.seasonLabel}</span>
            <h1 className={styles.title}>{season.title}</h1>
            <span className={styles.subtitle}>
              {season.place} · quedan {season.daysLeft} días
            </span>
          </div>
          <CoinPillCard tf={season.tf} />
        </div>

        <PassProgress
          level={season.level}
          xpCurrent={season.xpCurrent}
          xpMax={season.xpMax}
        />

        <LaneTabs />
      </header>

      <div className={styles.scroll}>
        <PassTrack season={season} />
      </div>

      <footer className={styles.footer}>
        <UnlockPremiumBar
          price={season.premiumPrice}
          summary={season.premiumSummary}
        />
      </footer>
    </div>
  );
}
