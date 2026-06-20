import api from "../api/client";
import type { PlayerProfileDto } from "../api/dto/session.dto";

export const tokagotchiService = {
  claimStarter: async (): Promise<PlayerProfileDto> => {
    const response = await api.post("/players/me/genesis-tokagotchi");
    return response.data;
  },
  activar: async (id: number): Promise<void> => {
    await api.post(`/tokagotchi/${id}/activate`);
  },
};
