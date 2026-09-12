import type { HomeResponseDTO } from "@/features/home/api/dto/home.dto";
import api from "@/shared/api/client";

/**
 * Contrato para obtener datos de la pantalla Home.
 */
export interface HomeApi {
  /**
   * Obtiene datos completos de la pantalla home
   * @returns serverTime, misiones claimables, perfil del jugador y tokagotchi activo
   */
  getHome(): Promise<HomeResponseDTO>;
}

export const home: HomeApi = {
  async getHome() {
    const { data } = await api.get<HomeResponseDTO>("/home");
    console.log("Peticion GET /home, Respuesta:", data);
    return data;
  }
};

export const homeApi: HomeApi = home;
