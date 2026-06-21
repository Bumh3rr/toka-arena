import type { SessionApi } from "../model/types";
import type { PlayerProfileDto } from "@/shared/api/dto/session.dto";
import api from "@/shared/api/client";
import { toPlayerProfile } from "../model/mapper";

export const realSessionApi: SessionApi = {
  async getMe() {
    const { data } = await api.get<PlayerProfileDto>("/players/me");
    console.log("Fetched player profile:", data);
    return toPlayerProfile(data);
  },
  async renameUsername(newUsername: string) {
    const { data } = await api.patch<PlayerProfileDto>("/players/me/name", { newUsername });
    console.log("Renamed player username:", data);
    return toPlayerProfile(data);
  },
};

export const sessionApi: SessionApi = realSessionApi;