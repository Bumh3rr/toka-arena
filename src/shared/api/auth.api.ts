import api from "@/shared/api/client";
import type { AuthApi } from "@/shared/api/contracts";
import type { AuthResponseDTO, LoginSuperAppRequestDTO } from "@/shared/api/dto/auth.dto";

export const auth: AuthApi = {
  async login(authCode: string) {
    const body: LoginSuperAppRequestDTO = { authCode: authCode };
    const { data } = await api.post<AuthResponseDTO>('/auth/login', body);
    console.log("Peticion POST /auth/login con body:", body, "Respuesta:", data);
    return data;
  },
};

export const authApi: AuthApi = auth;