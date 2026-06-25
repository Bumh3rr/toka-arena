import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL
import { tokenStore } from '../session/store/token.store'
import type { ApiErrorDTO } from './dto/api-error.dto'

/**
 * Instancia de Axios preconfigurada para consumir la API del backend.
 *
 * - `baseURL` se toma de `VITE_API_URL`.
 * - Envía cookies en cada petición (`withCredentials: true`).
 * - Añade el header `ngrok-skip-browser-warning` para evitar la pantalla
 *   de aviso de ngrok en entornos de desarrollo con túnel.
 *
 * Interceptores registrados:
 * - **Request**: inyecta el token JWT del `tokenStore` como `Authorization: Bearer <token>`.
 * - **Response**: ante un 401, emite el evento global `auth:expired` para que
 *   `SessionWatcher` limpie la sesión y redirija al login.
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
})

/** Inyecta el token de sesión en el header Authorization de cada petición. */
api.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * Interceptor de respuesta.
 * Un 401 indica que el token expiró o es inválido; se delega la limpieza
 * de sesión al listener del evento `auth:expired` registrado en SessionWatcher.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    return Promise.reject(error)
  }
)

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error inesperado",
): string {
  if (axios.isAxiosError<ApiErrorDTO>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default api