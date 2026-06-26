import type { PlayerProfileDto } from "./dto/player.dto";
import type { PlayerTokagotchisPageDTO } from "./dto/player.dto";
import api from "@/shared/api/client";
import type { PlayerApi } from "@/shared/api/contracts";
import { mapPlayerProfileDTO } from "@/shared/domain/mappers/player.mapper";
import { PlayerProfileDTOMock, PlayerTokagotchisPageDTOMock } from "../mock/mockData";

export const player: PlayerApi = {
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
  async getMyTokagotchis(page: number, size: number) {
    const { data } = await api.get<PlayerTokagotchisPageDTO>('/players/me/tokagotchis', { params: { page, size }})
    //await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulando retraso de 1 segundo
    console.log(`Peticion GET /players/me/tokagotchis?page=${page}&size=${size}, Respuesta:`, data)
    return data
  },
  async setMyActiveTokagotchi(tokagotchiId: string) {
    const { data } =await api.post('/players/me/active-tokagotchi', { tokagotchiId })
    console.log(`Peticion POST /players/me/active-tokagotchi con body: { tokagotchiId: ${tokagotchiId} }, Respuesta:`, data)
    return data
  },
};

export const playerMock: PlayerApi = {
  async getMe() {
    console.log("Peticion GET /players/me, Respuesta: (mocked)");
    return mapPlayerProfileDTO(PlayerProfileDTOMock());
  },
  async renamePlayerUsername(newUsername: string) {
    console.log("Peticion PATCH /players/me/name con body:", { newUsername }, "Respuesta: (mocked)");
    return mapPlayerProfileDTO(PlayerProfileDTOMock());
  },
  async getMyTokagotchis(page: number, size: number) {
    console.log(`Peticion GET /players/me/tokagotchis?page=${page}&size=${size}, Respuesta: (mocked)`);
    return PlayerTokagotchisPageDTOMock()
  },
  async setMyActiveTokagotchi(tokagotchiId: string) {
    const { data } =await api.post('/players/me/active-tokagotchi', { tokagotchiId })
    console.log(`Peticion POST /players/me/active-tokagotchi con body: { tokagotchiId: ${tokagotchiId} }, Respuesta:`, data)
    return data
  },
};

export const playerApi: PlayerApi = playerMock;