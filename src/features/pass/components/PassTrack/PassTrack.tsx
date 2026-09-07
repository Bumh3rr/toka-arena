import { useMemo } from "react";
import type { PassSeason, PassReward, PassLane } from "../../pass.types";
import { getRewardStatus } from "../../lib/rewardMeta";
import RewardCard from "../RewardCard/RewardCard";
import styles from "./PassTrack.module.css";

interface PassTrackProps {
  season: PassSeason;
}

type LevelSlot = Partial<Record<PassLane, PassReward>>;


function TrackNode({
  level,
  reached,
  big,
}: {
  level: number;
  reached: boolean;
  big: boolean;
}) {
  const cls = [
    styles.node,
    reached ? styles.reached : styles.lockedNode,
    big ? styles.nodeBig : styles.nodeSmall,
  ].join(" ");
  return <div className={cls}>{level}</div>;
}

export default function PassTrack({ season }: PassTrackProps) {
  const byLevel = useMemo(() => {
    const map = new Map<number, LevelSlot>();
    for (const r of season.rewards) {
      const slot = map.get(r.level) ?? {};
      slot[r.lane] = r;
      map.set(r.level, slot);
    }
    return map;
  }, [season.rewards]);

  const ctx = { level: season.level, isPremium: season.isPremium };
  const levels = Array.from({ length: season.totalTiers }, (_, i) => i + 1);

  return (
    <div className={styles.track}>
      <div className={styles.spine} aria-hidden="true" />

      {levels.map((level) => {
        const slot = byLevel.get(level);
        const free = slot?.FREE;
        const premium = slot?.PREMIUM;
        const hasReward = Boolean(free || premium);
        const reached = season.level >= level;

        return (
          <div
            key={level}
            className={`${styles.row} ${hasReward ? styles.withReward : styles.empty}`}
          >
            <div className={styles.left}>
              {free && <RewardCard reward={free} status={getRewardStatus(free, ctx)} />}
            </div>

            <div className={styles.nodeWrap}>
              <TrackNode level={level} reached={reached} big={hasReward} />
            </div>

            <div className={styles.right}>
              {premium && (
                <RewardCard reward={premium} status={getRewardStatus(premium, ctx)} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
