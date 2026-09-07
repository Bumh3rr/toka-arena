import { BridgeUnavailableError, callBridge, waitForBridge } from '@/shared/toka/bridge'
import { devApi } from '@/shared/dev/api/dev.api'
import { tokaFeedApi } from '../api/tokafeed.api'
import type { PurchaseResponseDTO } from '../api/dto/tokafeed.dto'

/**
 * Códigos que devuelve la JSAPI `pay` de la SuperApp
 * (docs/tokapay/references/miniapp-integration.md, "Request Payment").
 *
 * Son **informativos**: la verdad de un pago siempre sale de
 * `GET /purchases/{paymentId}`. El único que cambia el comportamiento es
 * CANCELLED, porque significa que el usuario dijo explícitamente que no.
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

/** No se pudo abrir la caja de pago: estamos fuera del WebView de Toka. */
export class CashierUnavailableError extends Error {
  constructor() {
    super('La compra solo está disponible dentro de la app de Toka')
    this.name = 'CashierUnavailableError'
  }
}

/** Cuánto esperamos a que la super app inyecte su bridge antes de rendirnos. */
const BRIDGE_TIMEOUT_MS = 3000

const isDevMode = import.meta.env.VITE_IS_DEV_MODE === 'true'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Todo lo que el flujo de compra necesita del mundo exterior. Existe para que
 * el modo dev sea una sola sustitución, en un solo archivo, en vez de un `if`
 * repartido por el hook y los componentes.
 */
export interface PaymentDriver {
  createPackagePurchase(
    packageId: string,
    tfToCredit: number,
    priceMxnCents: number
  ): Promise<PurchaseResponseDTO>
  createWelcomeBundlePurchase(tfAmount: number, priceMxnCents: number): Promise<PurchaseResponseDTO>
  /** Abre la caja de pago y devuelve su `resultCode`. */
  openCashier(paymentUrl: string): Promise<number>
  getPurchase(paymentId: string): Promise<PurchaseResponseDTO>
}

// ── Driver real ───────────────────────────────────────────────────────────────

const realDriver: PaymentDriver = {
  createPackagePurchase(packageId) {
    return tokaFeedApi.createPurchase(packageId)
  },

  createWelcomeBundlePurchase() {
    return tokaFeedApi.buyWelcomeBundle()
  },

  async openCashier(paymentUrl) {
    try {
      await waitForBridge(BRIDGE_TIMEOUT_MS)
    } catch (err) {
      if (err instanceof BridgeUnavailableError) throw new CashierUnavailableError()
      throw err
    }

    const res = await callBridge('pay', { paymentUrl })
    // Sin resultCode no sabemos qué pasó: se trata como desconocido y el
    // polling decide, que es exactamente el caso para el que existe 6004.
    return res.resultCode ?? PAY_RESULT.UNKNOWN
  },

  getPurchase(paymentId) {
    return tokaFeedApi.getPurchase(paymentId)
  },
}

// ── Driver de desarrollo ──────────────────────────────────────────────────────

/**
 * Simula el ciclo completo sin tocar Tokapay.
 *
 * No se crea orden real a propósito: crearía órdenes en el UAT de Tokapay que
 * solo pueden expirar. Para que el saldo no mienta, el TF se acredita de verdad
 * con el endpoint de desarrollo `POST /dev/add-tokafeed`.
 *
 * En producción esta rama no existe: `import.meta.env.VITE_IS_DEV_MODE` se
 * resuelve en build y el bundler elimina el código muerto.
 */
const devPayments = new Map<string, { purchase: PurchaseResponseDTO; credited: boolean }>()

const ORDER_EXPIRY_MS = 15 * 60 * 1000

function makeDevPurchase(tfToCredit: number, amountMxnCents: number): PurchaseResponseDTO {
  const purchase: PurchaseResponseDTO = {
    paymentId: `dev-${Date.now()}`,
    status: 'PROCESSING',
    paymentUrl: 'dev://cashier',
    tfToCredit,
    amountMxnCents,
    expiresAtMillis: Date.now() + ORDER_EXPIRY_MS,
  }
  devPayments.set(purchase.paymentId, { purchase, credited: false })
  return purchase
}

const devDriver: PaymentDriver = {
  async createPackagePurchase(_packageId, tfToCredit, priceMxnCents) {
    await sleep(400)
    return makeDevPurchase(tfToCredit, priceMxnCents)
  },

  async createWelcomeBundlePurchase(tfAmount, priceMxnCents) {
    await sleep(400)
    return makeDevPurchase(tfAmount, priceMxnCents)
  },

  async openCashier() {
    await sleep(600)
    return PAY_RESULT.SUCCESS
  },

  async getPurchase(paymentId) {
    const entry = devPayments.get(paymentId)
    if (!entry) throw new Error(`Pago de desarrollo desconocido: ${paymentId}`)

    // Acreditar una sola vez, aunque el polling pregunte varias.
    if (!entry.credited) {
      entry.credited = true
      await devApi.addTF(entry.purchase.tfToCredit)
      entry.purchase = { ...entry.purchase, status: 'SUCCESS' }
      devPayments.set(paymentId, entry)
    }

    return entry.purchase
  },
}

export const paymentDriver: PaymentDriver = isDevMode ? devDriver : realDriver
