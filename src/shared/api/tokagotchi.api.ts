import type { TokagotchiApi } from "./contracts";
import api from "./client";
import type { AscendResponseDTO, CareResponseDTO } from "./dto/tokagotchi-responses.dto";
import type { MainTokagotchiDTO } from "./dto/tokagotchi.dto";

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
   * Body: { newName: string }
   */
  async rename(_tokaId, name) {
    const body = { newName: name };
    const { data } = await api.patch<MainTokagotchiDTO>(`tokagotchis/${_tokaId}/name`, body);
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

/** Cliente HTTP para operaciones de Tokagotchi. Exportado como singleton. */
export const tokagotchiApi: TokagotchiApi = tokagotchi;