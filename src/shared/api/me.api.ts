import type { PlayerProfileDto } from "@/shared/api/dto/session.dto";
import api from "@/shared/api/client";
import type { SessionApi } from "@/shared/api/contracts";
import { mapPlayerProfileDTO } from "@/shared/domain/mappers/player.mapper";

export const realSessionApi: SessionApi = {
  async getMe() {
    const { data } = await api.get<PlayerProfileDto>("/players/me");
    console.log("Peticion GET /players/me, Respuesta:", data);
    return mapPlayerProfileDTO(data);
  },
  async renamePlayerUsername(newUsername: string) {
    const body = { newUsername };
    const { data } = await api.patch<PlayerProfileDto>("/players/me/name", body);
    console.log("Peticion PATCH /players/me/name con body:", body, "Respuesta:", data);
    return mapPlayerProfileDTO(data);
  },
};

export const sessionApi: SessionApi = realSessionApi;