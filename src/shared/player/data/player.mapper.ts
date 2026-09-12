import type { PlayerProfileDTO } from "../api/player.dto";
import type { PlayerProfile } from "./player";
import { mapTokagotchiDTO } from "../../domain/mappers/tokagotchi.mapper";

export const mapPlayerProfileDTO = (d: PlayerProfileDTO): PlayerProfile => ({
  serverTime: new Date(d.serverTime).getTime(),
  id: d.id,
  username: d.username,
  avatar: d.avatarUrl,
  tf: d.tokafeed,
  genesisClaimed: d.genesisClaimed,
  mainTokagotchi: d.mainTokagotchi ? mapTokagotchiDTO(d.mainTokagotchi) : null,
  stamina: {
    current: d.currentStamina,
    refillsToday: d.dailyStaminaRefillsCount,
    lastUpdate: new Date(d.lastStaminaUpdate).getTime(),
  },
  createdAt: Date.now(),
});

export const applyRenamePlayerUsername = (profile: PlayerProfile, newName: string): PlayerProfile => ({
  ...profile,
  username: newName
});

