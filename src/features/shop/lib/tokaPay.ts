import { BridgeUnavailableError, callBridge, waitForBridge } from '@/shared/toka/bridge'

/**
 * Códigos que devuelve la JSAPI `pay` de la SuperApp
 * (docs/tokapay/references/miniapp-integration.md, "Request Payment").
 *
 * Son informativos: la verdad de un pago siempre sale de
 * `GET /store/tokafeed/purchases/{paymentId}`. El único que cambia el
 * comportamiento es CANCELLED, porque es el usuario diciendo que no.
 */
export const PAY_RESULT = {
  SUCCESS: 9000,
  FAILED: 4000,
  PARAM_ILLEGAL: 8001,
  CANCELLED: 6001,
  UNKNOWN: 6004,
  RISK_DECLINED: 4001,
  RISK_AUTH_DECLINED: 4002,
} as const

/** Cuánto esperamos a que la super app inyecte su bridge antes de rendirnos. */
const BRIDGE_TIMEOUT_MS = 3000

/**
 * Abre la caja de pago de Toka y devuelve su `resultCode`.
 *
 * Fuera del WebView de la super app no existe el bridge, así que esto falla:
 * cobrar dinero real solo se puede hacer dentro de la app de Toka.
 */
export async function openCashier(paymentUrl: string): Promise<number> {
  try {
    await waitForBridge(BRIDGE_TIMEOUT_MS)
  } catch (err) {
    if (err instanceof BridgeUnavailableError) {
      throw new Error('La compra solo está disponible dentro de la app de Toka')
    }
    throw err
  }

  const res = await callBridge('pay', { paymentUrl })

  // Sin resultCode no sabemos qué pasó: se trata como desconocido y que decida
  // el polling, que es justo el caso para el que Tokapay define el 6004.
  return res.resultCode ?? PAY_RESULT.UNKNOWN
}
