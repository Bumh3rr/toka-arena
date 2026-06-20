import type { BridgeAuthCodeResponse } from './bridge.types'

export {}

/**
 * Interfaz del bridge nativo de Alipay inyectado por la super app en `window`.
 *
 * Expone el método `call` que permite invocar APIs nativas del dispositivo
 * o de la plataforma Toka (autenticación, pagos, etc.) desde el WebView.
 *
 * La super app inyecta este objeto antes de disparar el evento
 * `AlipayJSBridgeReady`; nunca debe accederse antes de que ese evento ocurra
 * (ver `waitForBridge` en `bridge.ts`).
 */
interface AlipayJSBridge {
  /**
   * Invoca un método nativo del bridge.
   *
   * @param method    Nombre del método nativo a llamar (ej. `"getUserDigitalIdentityAuthCode"`).
   * @param params    Parámetros que recibe el método nativo.
   * @param callback  Función que recibe la respuesta asíncrona del bridge.
   *                  El objeto puede ser parcial si el método falla antes de completarse.
   */
  call(
    method: string,
    params: Record<string, unknown>,
    callback?: (res: Partial<BridgeAuthCodeResponse>) => void
  ): void
}

declare global {
  interface Window {
    /** Bridge nativo de Alipay disponible dentro del WebView de la super app Toka. */
    AlipayJSBridge: AlipayJSBridge
  }
}