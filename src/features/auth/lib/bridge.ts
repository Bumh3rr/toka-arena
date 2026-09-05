import type { AuthCodeMethod, AuthCodeScopeMap, BridgeAuthCodeResponse } from '@/shared/domain/bridge.types'

/**
 * Espera a que el bridge nativo de Alipay (`AlipayJSBridge`) esté disponible
 * en `window` antes de continuar.
 *
 * - Si el bridge ya está inyectado, resuelve de inmediato.
 * - Si aún no está disponible, escucha el evento `AlipayJSBridgeReady` que
 *   la super app dispara cuando termina de inyectar el bridge, y resuelve
 *   en ese momento.
 *
 * Debe llamarse antes de cualquier `window.AlipayJSBridge.call(...)` para
 * garantizar que el objeto esté listo.
 */
export async function waitForBridge(): Promise<void> {
  return new Promise((resolve) => {
    if (window.AlipayJSBridge) {
      resolve()
    } else {
      document.addEventListener('AlipayJSBridgeReady', () => resolve(), { once: true })
    }
  })
}

/**
 * Solicita un auth code al bridge nativo de Alipay para el método y scopes
 * indicados. El auth code resultante se usa en el endpoint `/auth/login` para
 * autenticar al jugador contra el backend de Toka Arena.
 *
 * Internamente llama a `getUser{Method}AuthCode` en el bridge, pasando los
 * scopes requeridos. Un `resultCode === 10000` indica éxito; cualquier otro
 * valor se trata como error.
 *
 * @param method  Método de autenticación (ej. `"DigitalIdentity"`). Determina
 *                qué datos de identidad se solicitan a la super app.
 * @param scopes  Lista de scopes asociados al método. Define la granularidad
 *                de la información que el jugador autoriza compartir.
 * @returns       El auth code temporal emitido por la super app.
 * @throws        Si el bridge devuelve un `resultCode` distinto de 10000 o no
 *                incluye el campo `result`.
 *
 * @example
 * // Uso típico en acquireAuthCode()
 * await waitForBridge()
 * const code = await getAuthCode('DigitalIdentity', ['USER_ID', 'USER_NICKNAME'])
 */
export async function getAuthCode<M extends AuthCodeMethod>(
  method: M,
  scopes: AuthCodeScopeMap[M][]
): Promise<string> {
  return new Promise((resolve, reject) => {
    window.AlipayJSBridge.call(
      `getUser${method}AuthCode`,
      {
        usage: 'Autenticación en Toka Arena',
        scopes,
      },
      (res: Partial<BridgeAuthCodeResponse>) => {
        if (res.resultCode === 10000 && res.result) {
          resolve(res.result)
        } else {
          reject(new Error(`[${res.resultCode}] ${res.resultMsg ?? 'Error desconocido al autenticarse con Toka'}`))
        }
      }
    )
  })
}
