/**
 * Payload enviado al backend para iniciar sesión con el auth code
 * obtenido desde la super app o desde el modo desarrollo.
 */
export interface LoginSuperAppRequestDTO {
  /** Código temporal de autenticación provisto por la super app. */
  authCode: string
}

/**
 * Respuesta del backend luego de un login exitoso.
 * Incluye el token a persistir y metadatos sobre el jugador.
 */
export interface AuthResponseDTO {
  /** Token de sesión que se guarda en el token store. */
  token: string
  /** Identificador del jugador autenticado. */
  playerId: string
  /** Indica si el login creó una cuenta nueva o reutilizó una existente. */
  isNewPlayer: boolean
}