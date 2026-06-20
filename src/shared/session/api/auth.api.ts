import api from "@/shared/services/api";
import type { AuthResponseDTO, LoginSuperAppRequestDTO } from "@/shared/model/dto/dto.auth";

export async function login(authCode: string): Promise<AuthResponseDTO> {
  const body: LoginSuperAppRequestDTO = { authCode };
  const { data } = await api.post<AuthResponseDTO>('/auth/login', body);
  return data;
}