import api from "../api/client";
import type { MainTokagotchiDTO } from "../api/dto/tokagotchi.dto";
import type { PlayerProfileDto } from "./dto/session.dto";

export interface DevApi {
  resetCooldown(tokaId: string): Promise<MainTokagotchiDTO>;
  resetRarity(tokaId: string): Promise<MainTokagotchiDTO>;
  addCP(tokaId: string, amount: number): Promise<MainTokagotchiDTO>;
  addTF(amount: number): Promise<PlayerProfileDto>;
}

const dev: DevApi = {
    async resetCooldown(tokaId) {
        const { data } = await api.post<MainTokagotchiDTO>(`/tokagotchis/${tokaId}/reset-cooldowns`);
        console.log("Peticion POST /tokagotchis/${tokaId}/reset-cooldowns con body: {} Respuesta:", data);
        return data;
    },
    async resetRarity(tokaId) {
        const { data } = await api.post<MainTokagotchiDTO>(`/tokagotchis/${tokaId}/reset-rarity`);
        console.log("Peticion POST /tokagotchis/${tokaId}/reset-rarity con body: {} Respuesta:", data);
        return data;
    },
    async addCP(tokaId, amount) {
        const { data } = await api.post<MainTokagotchiDTO>(`/tokagotchis/${tokaId}/add-carepoints?amount=${amount}`);   
        console.log("Peticion POST /tokagotchis/${tokaId}/add-carepoints con body:", { amount }, "Respuesta:", data);
        return data;
    },
    async addTF(amount) {
        const { data } = await api.post<PlayerProfileDto>(`/players/me/add-tokafeed?amount=${amount}`);
        console.log("Peticion POST /players/me/add-tokafeed con body:", { amount }, "Respuesta:", data);
        return data;
    }
};

export const devApi: DevApi = dev;


