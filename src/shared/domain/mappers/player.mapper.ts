import type { PlayerProfileDto } from "@/shared/api/dto/session.dto";
import type { PlayerProfile } from "../player";
import { mapMainTokagotchiDTO } from "./tokagotchi.mapper";

export const mapPlayerProfileDTO = (d: PlayerProfileDto): PlayerProfile => ({
  id: d.id,
  username: d.username,
  avatar: d.avatarUrl,
  tf: d.tokafeed,
  genesisClaimed: d.genesisClaimed,
  mainTokagotchi: d.mainTokagotchi ? mapMainTokagotchiDTO(d.mainTokagotchi) : null,
  createdAt: Date.now(),
});

