import type { PlayerProfileDTO } from "@/shared/player/api/player.dto";
import api from "../../api/client";
import type { TokagotchiDTO } from "../../api/dto/tokagotchi.dto";
import type { Rarity, Species } from "../../domain/tokagotchi";

export interface DevApi {
  resetCooldown(tokaId: string): Promise<TokagotchiDTO>;
  resetRarity(tokaId: string): Promise<TokagotchiDTO>;
  addCP(tokaId: string, amount: number): Promise<TokagotchiDTO>;
  addTF(amount: number): Promise<PlayerProfileDTO>;
  addTokagotchi(species: Species, rarity: Rarity): Promise<PlayerProfileDTO>;
}

const dev: DevApi = {
    async resetCooldown(tokaId) {
        const { data } = await api.post<TokagotchiDTO>(`/dev/${tokaId}/reset-cooldowns`);
        console.log("Peticion POST /dev/${tokaId}/reset-cooldowns con body: {} Respuesta:", data);
        return data;
    },
    async resetRarity(tokaId) {
        const { data } = await api.post<TokagotchiDTO>(`/dev/${tokaId}/reset-rarity`);
        console.log("Peticion POST /dev/${tokaId}/reset-rarity con body: {} Respuesta:", data);
        return data;
    },
    async addCP(tokaId, amount) {
        const { data } = await api.post<TokagotchiDTO>(`/dev/${tokaId}/add-carepoints?amount=${amount}`);   
        console.log("Peticion POST /dev/${tokaId}/add-carepoints con body:", { amount }, "Respuesta:", data);
        return data;
    },
    async addTF(amount) {
        const { data } = await api.post<PlayerProfileDTO>(`/dev/add-tokafeed?amount=${amount}`);
        console.log("Peticion POST /dev/add-tokafeed con body:", { amount }, "Respuesta:", data);
        return data;
    },
    async addTokagotchi(species, rarity) {
        const body = { species, rarity };
        const { data } = await api.post<PlayerProfileDTO>(`/dev/create-tokagotchi`, body);
        console.log("Peticion POST /dev/add-tokagotchi con body:", body, "Respuesta:", data);
        return data;
    }
};

export const devApi: DevApi = dev;


