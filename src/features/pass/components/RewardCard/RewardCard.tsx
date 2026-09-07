import { Button, Label } from "@/shared/ui/Kit";
import { IcLock, IcClothes } from "@/shared/ui/Icons/Icons";
import type { PassReward, RewardStatus } from "../../pass.types";
import {
  getRewardTitle,
  getRewardSubtitle,
  getRewardGlyph,
} from "../../lib/rewardMeta";
import styles from "./RewardCard.module.css";

interface RewardCardProps {
  reward: PassReward;
  status: RewardStatus;
}

function Glyph({ reward }: { reward: PassReward }) {
  const g = getRewardGlyph(reward);
  if (g.kind === "accessory") {
    return (
      <span className={styles.glyphIcon} aria-hidden="true">
        <IcClothes />
      </span>
    );
  }
  return <img className={styles.glyphImg} src={g.src} alt={g.alt} />;
}


export default function RewardCard({ reward, status }: RewardCardProps) {
  const exclusive = reward.exclusive === true;
  const locked = status === "locked";
  const claimable = status === "claimable";

  const cls = [
    styles.card,
    exclusive ? styles.exclusive : "",
    locked ? styles.locked : "",
    claimable ? styles.claimable : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      <div className={styles.glyph}>
        <Glyph reward={reward} />
      </div>

      <div className={styles.body}>
        <span className={styles.title}>{getRewardTitle(reward)}</span>
        <span className={styles.sub}>{getRewardSubtitle(reward)}</span>

        {claimable && (
          <Button
            variant="green"
            size="sm"
            radius="md"
            className={styles.claimBtn}
          >
            Reclamar
          </Button>
        )}

        {exclusive && (
          <Label
            variant="purple"
            look="solid"
            size="xs"
            uppercase
            className={styles.exclusiveTag}
          >
            Exclusivo
          </Label>
        )}
      </div>

      {locked && (
        <span className={styles.lock} aria-hidden="true">
          <IcLock />
        </span>
      )}
    </div>
  );
}
