import api from "@/shared/api/client";
import type { UnboxingApi } from "../type";
import type { PlayerProfileDTO } from "@/shared/player/api/player.dto";
import type { TokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto";

const realUnboxingApi: UnboxingApi = {
  async getUnboxing() {
    const { data } = await api.post<PlayerProfileDTO>('/players/me/genesis-tokagotchi');
    return data;
  },
  
  async rename(id: string, newName: string) {
    const body = { newName };
    const { data } = await api.patch<TokagotchiDTO>(`/tokagotchis/${id}/name`, body);
    return data;
  },
};

export const unboxingApi: UnboxingApi = realUnboxingApi;
