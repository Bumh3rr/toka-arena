import type { PassResponseDTO } from "../pass.types";

export interface PassApi {
  getPass(): Promise<PassResponseDTO>;
}

// Campos estáticos del pase; serverTime se calcula en cada respuesta (es "ahora").
const db: Omit<PassResponseDTO, "serverTime"> = {
  season: "T1",
  tier: 80,
  totalTiers: 100,
  isPremium: false,
  endsAt: "2026-07-01T00:00:00Z",
};
const delay = (ms = 1500) => new Promise((r) => setTimeout(r, ms));

export const mockPassApi: PassApi = {
  async getPass() {
    await delay();
    return { serverTime: new Date().toISOString(), ...structuredClone(db) };
  },
};

// ════ SWAP POINT ════
export const passApi: PassApi = mockPassApi;
