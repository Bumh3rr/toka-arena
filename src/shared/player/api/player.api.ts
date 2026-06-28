import type { PlayerProfileDTO } from "./player.dto";
import type { PlayerTokagotchisPageDTO } from "./player.dto";
import api from "@/shared/api/client";
import { mapPlayerProfileDTO } from "@/shared/player/data/player.mapper";
import { PlayerProfileDTOMock, PlayerTokagotchisPageDTOMock, toka_activo } from "../../mock/mockData";
import { mapTokagotchiDTO } from "../../domain/mappers/tokagotchi.mapper";
import type { PlayerProfile } from "../data/player";
import type { Tokagotchi } from "@/shared/domain/tokagotchi";

/**
 * Contrato para operaciones de sesión del jugador autenticado.
 */
export interface PlayerApi {
  /**
   * Obtiene el perfil actual del jugador autenticado.
   * @returns Perfil del jugador en formato de dominio
   */
  getMe(): Promise<PlayerProfile>;

  /**
   * Renombra el username del jugador autenticado.
   * @param newUsername - Nuevo username del jugador
   * @returns Perfil del jugador actualizado
   */
  renamePlayerUsername(newUsername: string): Promise<PlayerProfile>;

  /**
   * Obtiene la lista paginada de tokagotchis del jugador autenticado.
   * @param page - Índice de página (base 0)
   * @param size - Tamaño de página
   */
  getMyTokagotchis(page: number, size: number): Promise<PlayerTokagotchisPageDTO>;

  /**
   * Establece el tokagotchi activo del jugador autenticado.
   */
  setMyActiveTokagotchi(tokagotchiId: string): Promise<Tokagotchi>;
}

export const player: PlayerApi = {
  async getMe() {
    const { data } = await api.get<PlayerProfileDTO>("/players/me");
    console.log("Peticion GET /players/me, Respuesta:", data);
    return mapPlayerProfileDTO(data);
  },
  async renamePlayerUsername(newUsername: string) {
    const body = { newUsername };
    const { data } = await api.patch<PlayerProfileDTO>("/players/me/name", body);
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
    console.log(`Peticion POST /players/me/active-tokagotchi con body: { tokagotchiId: ${tokagotchiId} }, Respuesta: (mocked)`);
    return mapTokagotchiDTO(toka_activo);
  },
};

export const playerApi: PlayerApi = player;