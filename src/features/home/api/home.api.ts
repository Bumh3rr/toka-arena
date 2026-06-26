import type { HomeApi } from "@/shared/api/contracts";
import type { HomeResponseDTO } from "@/shared/api/dto/home.dto";
import api from "@/shared/api/client";
import { HomeResponseDTOMock } from "@/shared/mock/mockData";

export const home: HomeApi = {
  async getHome() {
    const { data } = await api.get<HomeResponseDTO>("/home");
    console.log("Peticion GET /home, Respuesta:", data);
    return data;
  }
};

export const homeMock: HomeApi = {
  async getHome() {
    return HomeResponseDTOMock();
  }
};

export const homeApi: HomeApi = homeMock;
