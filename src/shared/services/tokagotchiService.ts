import api from "./api";
import type { TokagotchiActive } from "../types/tokagotchi";

export const tokagotchiService = {
  claimStarter: async (): Promise<TokagotchiActive> => {
    const response = await api.post("/tokagotchi/claim-starter");
    return response.data;
  },
  activar: async (id: number): Promise<void> => {
    await api.post(`/tokagotchi/${id}/activate`);
  },
};
