import type { SessionApi } from "../model/types";
import type { PlayerProfileDto } from "@/shared/model/dto/dto.session";
import api from "@/shared/services/api";
import { toPlayerProfile } from "../model/mapper";

export const mockSessionApi: SessionApi = {
  async getMe() {
    const { data } = await api.get<PlayerProfileDto>("/players/me");
    return toPlayerProfile(data);
  },
};

export const sessionApi: SessionApi = mockSessionApi;
