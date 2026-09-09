/**
 * DTOs de la compra de TokaFeed con dinero real (Tokapay Mini-Program Direct Pay).
 * Espejo de `toka-arena-backend/docs/api/tokafeed-purchase.md`, base `/store/tokafeed`.
 *
 * Los importes viajan en **centavos de MXN** (19900 = $199.00), que es el formato
 * que exige Tokapay. Dividir entre 100 solo al presentar.
 */

/** Estado de un pago según el backend. La fuente de verdad, nunca el resultCode de la caja. */
export type PaymentStatusDTO = 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'EXPIRED'

/** Paquete de TF comprable con dinero real — `GET /store/tokafeed/packages`. */
export interface TokaFeedPackageDTO {
  id: string
  displayName: string
  tfBase: number
  tfBonus: number
  /** `tfBase + tfBonus`: lo que realmente se acredita. */
  totalTf: number
  priceMxnCents: number
}

/** Cuerpo de `POST /store/tokafeed/purchases`. */
export interface InitiatePurchaseRequestDTO {
  packageId: string
}

/**
 * Estado de una compra — respuesta de `POST /purchases`, `POST /welcome-bundle`
 * y `GET /purchases/{paymentId}`.
 */
export interface PurchaseResponseDTO {
  paymentId: string
  status: PaymentStatusDTO
  /** URL de la caja de pago, para la JSAPI `pay`. */
  paymentUrl: string
  tfToCredit: number
  amountMxnCents: number
  /** Epoch en ms. Pasado ese punto el backend cierra la orden en Tokapay. */
  expiresAtMillis: number
}

/** Oferta de bienvenida — `GET /store/tokafeed/welcome-bundle`. */
export interface WelcomeBundleOfferDTO {
  /** `false` si el jugador ya la reclamó: no mostrar la tarjeta. */
  available: boolean
  priceMxnCents: number
  /** Valor sin descuento, solo informativo (para el tachado). */
  originalValueMxnCents: number
  tfAmount: number
  eggRarity: string
  /** Frase con lo que incluye, ya redactada por el backend. */
  description: string
}
