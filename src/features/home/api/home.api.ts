import type { HomeResponseDTO } from "@/shared/api/dto/home.dto";
import type { HomeApi } from "@/shared/api/contracts";
import api from "@/shared/api/client";

export const home: HomeApi = {
  async getHome() {
    const { data } = await api.get<HomeResponseDTO>("/home");
    console.log("Peticion GET /home, Respuesta:", data);
    return data;
  }
};

export const homeApi: HomeApi = home;
