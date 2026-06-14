import type { MeResponseDTO } from "../session.types";

export interface SessionApi {
  getMe(): Promise<MeResponseDTO>;
}

const db: MeResponseDTO = {
  id: 343434,
  username: "test",
  avatar: null,
  wallet: { tf: 42 },
  activeTokaId: 1023,
  createdAt: "2026-05-01T10:00:00Z",
};
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const mockSessionApi: SessionApi = {
  async getMe() {
    await delay();
    return structuredClone(db);
  },
};

// AGREGAR — helpers SOLO-mock para que ascend pueda mover el wallet (session es dueño del TF).
// Se borra cuando entre el backend real.
export const _mockWallet = {
  get: () => db.wallet.tf,
  debit: (amount: number) => { db.wallet.tf = Math.max(0, db.wallet.tf - amount); return db.wallet.tf; },
  credit: (amount: number) => { db.wallet.tf += amount; return db.wallet.tf; },
};

// ════ SWAP POINT ════
export const sessionApi: SessionApi = mockSessionApi;
