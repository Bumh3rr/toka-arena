import type { BridgeResponse } from '@/shared/domain/bridge.types'

/** El bridge de la super app no está disponible (estamos fuera del WebView de Toka). */
export class BridgeUnavailableError extends Error {
  constructor(message = 'El bridge de Toka no está disponible') {
    super(message)
    this.name = 'BridgeUnavailableError'
  }
}

/**
 * Espera a que el bridge nativo de Alipay (`AlipayJSBridge`) esté disponible
 * en `window` antes de continuar.
 *
 * - Si el bridge ya está inyectado, resuelve de inmediato.
 * - Si aún no está disponible, escucha el evento `AlipayJSBridgeReady` que
 *   la super app dispara cuando termina de inyectar el bridge.
 *
 * @param timeoutMs  Milisegundos antes de rendirse. `0` (default) espera
 *                   indefinidamente — fuera de la super app ese evento nunca
 *                   llega, así que todo consumidor que pueda correr en un
 *                   navegador normal debe pasar un timeout.
 * @throws BridgeUnavailableError si se agota el timeout.
 */
export async function waitForBridge(timeoutMs = 0): Promise<void> {
  if (window.AlipayJSBridge) return

  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined

    const onReady = () => {
      if (timer) clearTimeout(timer)
      resolve()
    }

    document.addEventListener('AlipayJSBridgeReady', onReady, { once: true })

    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        document.removeEventListener('AlipayJSBridgeReady', onReady)
        reject(new BridgeUnavailableError())
      }, timeoutMs)
    }
  })
}

/**
 * Promisifica `AlipayJSBridge.call`. No interpreta el `resultCode`: cada JSAPI
 * tiene su propia tabla de códigos, así que eso es cosa de quien llama.
 *
 * Debe llamarse después de `waitForBridge()`.
 */
export function callBridge<T extends BridgeResponse = BridgeResponse>(
  method: string,
  params: Record<string, unknown>
): Promise<Partial<T>> {
  return new Promise((resolve) => {
    window.AlipayJSBridge.call<T>(method, params, (res) => resolve(res))
  })
}
