import type { PlayerProfileDto } from "@/shared/api/dto/player.dto";
import type { PlayerProfile } from "../player";
import { mapTokagotchiDTO } from "./tokagotchi.mapper";

export const mapPlayerProfileDTO = (d: PlayerProfileDto): PlayerProfile => ({
  id: d.id,
  username: d.username,
  avatar: d.avatarUrl,
  tf: d.tokafeed,
  genesisClaimed: d.genesisClaimed,
  mainTokagotchi: d.mainTokagotchi ? mapTokagotchiDTO(d.mainTokagotchi) : null,
  createdAt: Date.now(),
});

