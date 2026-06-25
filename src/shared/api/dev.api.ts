import api from "../api/client";
import type { TokagotchiDTO } from "../api/dto/tokagotchi.dto";
import type { PlayerProfileDto } from "./dto/player.dto";

export interface DevApi {
  resetCooldown(tokaId: string): Promise<TokagotchiDTO>;
  resetRarity(tokaId: string): Promise<TokagotchiDTO>;
  addCP(tokaId: string, amount: number): Promise<TokagotchiDTO>;
  addTF(amount: number): Promise<PlayerProfileDto>;
}

const dev: DevApi = {
    async resetCooldown(tokaId) {
        const { data } = await api.post<TokagotchiDTO>(`/tokagotchis/${tokaId}/reset-cooldowns`);
        console.log("Peticion POST /tokagotchis/${tokaId}/reset-cooldowns con body: {} Respuesta:", data);
        return data;
    },
    async resetRarity(tokaId) {
        const { data } = await api.post<TokagotchiDTO>(`/tokagotchis/${tokaId}/reset-rarity`);
        console.log("Peticion POST /tokagotchis/${tokaId}/reset-rarity con body: {} Respuesta:", data);
        return data;
    },
    async addCP(tokaId, amount) {
        const { data } = await api.post<TokagotchiDTO>(`/tokagotchis/${tokaId}/add-carepoints?amount=${amount}`);   
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


