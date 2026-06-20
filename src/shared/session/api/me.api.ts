import type { SessionApi } from "../model/types";
import type { PlayerProfileDto } from "@/shared/api/dto/session.dto";
import api from "@/shared/api/client";
import { toPlayerProfile } from "../model/mapper";

export const realSessionApi: SessionApi = {
  async getMe() {
    const { data } = await api.get<PlayerProfileDto>("/players/me");
    return toPlayerProfile(data);
  },
};

export const sessionApi: SessionApi = realSessionApi;