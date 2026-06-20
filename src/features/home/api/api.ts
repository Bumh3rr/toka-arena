//import type { HomeResponseDTO, CareResponseDTO, RenameResponseDTO} from "../data/dto";
//import type { AscendResponseDTO} from "../data/dto";
import type { HomeApi } from "../data/types"; 
//import api from "@/shared/services/api";
import { responseHomeResponseDTO ,responseRenameResponseDTO, responseCareResponseDTO, responseAscendResponseDTO } from "../mock/db";

export const mockHomeApi: HomeApi = {
  async getHome() {
    //const { data } = await api.get<HomeResponseDTO>("/home");
    console.log("Simulando llamada a getHome");
    const data = responseHomeResponseDTO;
    return data;
  },
  async care(_tokaId, action) {
    //const { data } = await api.get<CareResponseDTO>(`tokagotchi/${_tokaId}/care`, { params: { action } });
    console.log(`Simulando acción de cuidado: ${action} para tokaId: ${_tokaId}`);
    const data = responseCareResponseDTO;
    return data;
  },
  async rename(_tokaId, name) {
    //const { data } = await api.get<RenameResponseDTO>(`tokagotchi/${_tokaId}/rename`, { params: { name } });
    console.log(`Simulando acción de renombrar: ${name} para tokaId: ${_tokaId}`);
    const data = responseRenameResponseDTO(name);
    return data;
  },
  async ascend(_tokaId) {
    //const { data } = await api.post<AscendResponseDTO>(`tokagotchi/${_tokaId}/ascend`);
    console.log(`Simulando acción de ascender para tokaId: ${_tokaId}`);
    const data = responseAscendResponseDTO;
    return data;
  },
};

export const homeApi: HomeApi = mockHomeApi;
