import { waitForBridge, getAuthCode } from '@/features/auth/lib/bridge'
import type { DigitalIdentityScope } from '@/shared/domain/bridge.types'

// Scopes solocitados para autenticarse
const SCOPES: DigitalIdentityScope[] = ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME']
// Flag para activar el modo desarrollo
const isDevMode = import.meta.env.VITE_IS_DEV_MODE === 'true'

/**
 * Obtiene un authCode para el login.
 *
 * - En el super-app (bridge de Alipay disponible): pide el code real vía `getAuthCode`.
 * - En desarrollo sin bridge (navegador): usa `VITE_DEV_AUTH_CODE` para ejercitar el
 *   flujo real contra `/auth/login`.
 *
 * @throws si no hay bridge ni code de dev configurado.
 */
export async function acquireAuthCode(): Promise<string> {
  if (isDevMode) {
    const devCode = import.meta.env.VITE_DEV_AUTH_CODE
    if (!devCode) throw new Error('Falta VITE_DEV_AUTH_CODE para iniciar sesión en modo desarrollo')
    return devCode
  }

  await waitForBridge()
  return getAuthCode('DigitalIdentity', SCOPES)
}
