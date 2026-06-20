import api from "@/shared/api/client";
import type { UnboxingApi } from "../type";
import type { PlayerProfileDto,MainTokagotchiDTO } from "@/shared/api/dto/session.dto";

const realUnboxingApi: UnboxingApi = {
  async getUnboxing() {
    const { data } = await api.post<PlayerProfileDto>('/players/me/genesis-tokagotchi');
    return data;
  },
  async rename(id: number, newName: string) {
    const body = { newName };
    const { data } = await api.patch<MainTokagotchiDTO>(`/tokagotchis/${id}/name`, body);
    return data;
  },
};

export const unboxingApi: UnboxingApi = realUnboxingApi;
