import type { PlayerProfile } from "@/shared/domain/player";

export const applyRenamePlayerUsername = (profile: PlayerProfile, newName: string): PlayerProfile => ({
  ...profile,
  username: newName
});