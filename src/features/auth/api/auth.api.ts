import api from "@/shared/api/client";
import type { AuthResponseDTO, LoginSuperAppRequestDTO } from "@/features/auth/api/dto/auth.dto";

/**
 * Contrato para autenticación por código (OAuth/bridge).
 */
export interface AuthApi {
  /**
   * Realiza login con un authCode emitido por el proveedor de autenticación.
   * @param authCode - Código de autorización temporal
   * @returns Tokens y datos mínimos de sesión
   */
  login(authCode: string): Promise<AuthResponseDTO>;
}

export const auth: AuthApi = {
  async login(authCode: string) {
    const body: LoginSuperAppRequestDTO = { authCode: authCode };
    const { data } = await api.post<AuthResponseDTO>('/auth/login', body);
    console.log("Peticion POST /auth/login con body:", body, "Respuesta:", data);
    return data;
  },
};

export const authApi: AuthApi = auth;