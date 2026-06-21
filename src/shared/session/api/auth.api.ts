import api from "@/shared/api/client";
import type { AuthResponseDTO, LoginSuperAppRequestDTO } from "@/shared/api/dto/auth.dto";
import type { AuthApi } from "../model/types";

export const realAuthApi: AuthApi = {
  async login(authCode: string) {
    const body: LoginSuperAppRequestDTO = { authCode: authCode };
    const { data } = await api.post<AuthResponseDTO>('/auth/login', body);
    return data;
  },
};

export const authApi: AuthApi = realAuthApi;