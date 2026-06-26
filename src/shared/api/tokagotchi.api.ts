import type { TokagotchiApi } from "./contracts";
import api from "./client";
import type { AscendResponseDTO, CareResponseDTO } from "./dto/tokagotchi-responses.dto";
import type { TokagotchiDTO } from "./dto/tokagotchi.dto";
import { CareResponseDTOMock } from "../mock/mockData";

/**
 * Implementación del cliente HTTP para operaciones de Tokagotchi.
 * Comunica con endpoints de backend siguiendo el contrato TokagotchiApi.
 */
const tokagotchi: TokagotchiApi = {
  /**
   * POST /tokagotchis/{id}/care
   * Body: { action: "FEED" | "PLAY" | "BATHE" }
   */
  async care(_tokaId, action) {
    const body = { action: action };
    const { data } = await api.post<CareResponseDTO>(`tokagotchis/${_tokaId}/care`, body);
    console.log("Peticion POST /tokagotchis/${_tokaId}/care con body:", body, "Respuesta:", data);
    return data;
  },

  /**
   * PATCH /tokagotchis/{id}/name
   * Body: { newTokagotchiName: string }
   */
  async rename(_tokaId, newName) {
    const body = { newTokagotchiName: newName };
    const { data } = await api.patch<TokagotchiDTO>(`tokagotchis/${_tokaId}/name`, body);
    console.log("Peticion PATCH /tokagotchis/${_tokaId}/name con body:", body, "Respuesta:", data);
    return data;
  },

  /**
   * POST /tokagotchis/{id}/evolve
   * Sin body. Intenta evolucionar el tokagotchi.
   */
  async ascend(_tokaId) {
    const { data } = await api.post<AscendResponseDTO>(`tokagotchis/${_tokaId}/evolve`);
    console.log("Peticion POST /tokagotchis/${_tokaId}/evolve sin body. Respuesta:", data);
    return data;
  },
};

export const tokagotchiApiMock: TokagotchiApi = {
  async care(_tokaId, action) {
    console.log("Mocked care called with:", _tokaId, action);
    return CareResponseDTOMock();
  },
  rename: function (tokaId: string, name: string): Promise<TokagotchiDTO> {
    throw new Error("Function not implemented.");
  },
  ascend: function (tokaId: string): Promise<AscendResponseDTO> {
    throw new Error("Function not implemented.");
  }
}

/** Cliente HTTP para operaciones de Tokagotchi. Exportado como singleton. */
export const tokagotchiApi: TokagotchiApi = tokagotchiApiMock;



