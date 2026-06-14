export interface MeResponseDTO {
  id: number;
  username: string;
  avatar: string | null;
  wallet: { tf: number };
  activeTokaId: number | null; // null = sin toka → /unboxing
  createdAt: string;
}
export interface Session {
  id: number;
  username: string;
  avatar: string | null;
  tf: number;
  activeTokaId: number | null;
  createdAt: number; // ms
}
