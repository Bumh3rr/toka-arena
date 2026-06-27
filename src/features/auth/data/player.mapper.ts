import type { PlayerProfileDto } from "../../../shared/player/api/player.dto";
import type { PlayerProfile } from "./player";
import { mapTokagotchiDTO } from "../../../shared/domain/mappers/tokagotchi.mapper";

export const mapPlayerProfileDTO = (d: PlayerProfileDto): PlayerProfile => ({
  id: d.id,
  username: d.username,
  avatar: d.avatarUrl,
  tf: d.tokafeed,
  genesisClaimed: d.genesisClaimed,
  mainTokagotchi: d.mainTokagotchi ? mapTokagotchiDTO(d.mainTokagotchi) : null,
  createdAt: Date.now(),
});

export const applyRenamePlayerUsername = (profile: PlayerProfile, newName: string): PlayerProfile => ({
  ...profile,
  username: newName
});

