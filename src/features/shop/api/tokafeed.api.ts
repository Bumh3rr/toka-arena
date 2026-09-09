import api from '@/shared/api/client'
import type {
  InitiatePurchaseRequestDTO,
  PurchaseResponseDTO,
  TokaFeedPackageDTO,
  WelcomeBundleOfferDTO,
} from './dto/tokafeed.dto'

/**
 * Contrato del cliente HTTP de la compra de TokaFeed con dinero real.
 * Ver `toka-arena-backend/docs/api/tokafeed-purchase.md`.
 */
export interface TokaFeedApi {
  /** `GET /store/tokafeed/packages` — catálogo de paquetes activos, ya ordenado. */
  getPackages(): Promise<TokaFeedPackageDTO[]>

  /**
   * `POST /store/tokafeed/purchases` — crea la orden en Tokapay (202).
   *
   * Si el jugador ya tiene un pago vigente del mismo paquete, el backend
   * devuelve ESE mismo pago con la misma `paymentUrl` en vez de crear otra
   * orden: un doble tap no produce doble cobro.
   */
  createPurchase(packageId: string): Promise<PurchaseResponseDTO>

  /** `GET /store/tokafeed/purchases/{paymentId}` — fuente de verdad del estado del pago. */
  getPurchase(paymentId: string): Promise<PurchaseResponseDTO>

  /** `GET /store/tokafeed/welcome-bundle` — si la oferta única sigue disponible. */
  getWelcomeBundleOffer(): Promise<WelcomeBundleOfferDTO>

  /** `POST /store/tokafeed/welcome-bundle` — crea la orden del bundle (202). */
  buyWelcomeBundle(): Promise<PurchaseResponseDTO>
}

const tokafeed: TokaFeedApi = {
  async getPackages() {
    const { data } = await api.get<TokaFeedPackageDTO[]>('/store/tokafeed/packages')
    console.log('Peticion GET /store/tokafeed/packages, Respuesta:', data)
    return data
  },

  async createPurchase(packageId) {
    const body: InitiatePurchaseRequestDTO = { packageId }
    const { data } = await api.post<PurchaseResponseDTO>('/store/tokafeed/purchases', body)
    console.log('Peticion POST /store/tokafeed/purchases con body:', body, 'Respuesta:', data)
    return data
  },

  async getPurchase(paymentId) {
    const { data } = await api.get<PurchaseResponseDTO>(`/store/tokafeed/purchases/${paymentId}`)
    console.log(`Peticion GET /store/tokafeed/purchases/${paymentId}, Respuesta:`, data)
    return data
  },

  async getWelcomeBundleOffer() {
    const { data } = await api.get<WelcomeBundleOfferDTO>('/store/tokafeed/welcome-bundle')
    console.log('Peticion GET /store/tokafeed/welcome-bundle, Respuesta:', data)
    return data
  },

  async buyWelcomeBundle() {
    const { data } = await api.post<PurchaseResponseDTO>('/store/tokafeed/welcome-bundle')
    console.log('Peticion POST /store/tokafeed/welcome-bundle, Respuesta:', data)
    return data
  },
}

export const tokaFeedApi: TokaFeedApi = tokafeed
