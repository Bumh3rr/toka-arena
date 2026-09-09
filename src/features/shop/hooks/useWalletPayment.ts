import { useCallback, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import { getApiErrorMessage } from '@/shared/api/client'
import { tokaFeedApi } from '../api/tokafeed.api'
import { walletKeys } from '../swr/keys'
import { PAY_RESULT, openCashier } from '../lib/tokaPay'
import type { PurchaseResponseDTO, WelcomeBundleOfferDTO } from '../api/dto/tokafeed.dto'
import type { TfPackView } from './useTfPackages'

/**
 * Paso del flujo de compra. Cada valor se corresponde con lo que ve el jugador:
 *
 * - `idle`      nada abierto
 * - `confirm`   hoja de confirmación, esperando que acepte el cargo
 * - `paying`    creando la orden y abriendo la caja de pago de Toka
 * - `checking`  la caja se cerró; reconsultando al backend cómo terminó
 * - `done`      TF acreditado
 * - `error`     no se completó; `error` dice por qué
 * - `pending`   se agotó la espera en pantalla, el pago puede seguir vivo
 */
export type PaymentStep = 'idle' | 'confirm' | 'paying' | 'checking' | 'done' | 'error' | 'pending'

/** Lo que se está comprando. Plano a propósito: es lo que pintan las hojas. */
export interface WalletPurchase {
  name: string
  /** TF total que se acredita. */
  tf: number
  /** TF de bonus incluidos (0 si no aplica). */
  bonus: number
  /** Precio en pesos. */
  mxn: number
  /** Lo que incluye además del TF (solo el Welcome Bundle). */
  extras?: string
  /** El Welcome Bundle también da huevo y accesorio, y deja de estar disponible. */
  isBundle: boolean
}

interface UseWalletPaymentResult {
  step: PaymentStep
  /** Qué se está comprando, o `null` si no hay nada en curso. */
  purchase: WalletPurchase | null
  /** Motivo del fallo cuando `step` es `error`. */
  error: string
  /** Abre la confirmación de un paquete de TF. */
  choosePack: (pack: TfPackView) => void
  /** Abre la confirmación del Welcome Bundle. */
  chooseBundle: (offer: WelcomeBundleOfferDTO) => void
  /** Crea la orden y abre la caja de pago. Sirve también para reintentar. */
  pay: () => Promise<void>
  /** Consulta suelta del estado, para el botón "Actualizar" de `pending`. */
  check: () => Promise<void>
  /** Cierra el flujo y vuelve a `idle`. Corta el polling. */
  close: () => void
}

/** Cada cuánto se reconsulta el estado del pago. */
const CHECK_INTERVAL_MS = 3000
/** Cuánto se espera en pantalla antes de rendirse y pasar a `pending`. */
const CHECK_WINDOW_MS = 90_000

/**
 * Compra de TokaFeed con dinero real, de principio a fin.
 *
 * El `resultCode` que devuelve la caja de pago NO decide nada: la fuente de
 * verdad es `GET /store/tokafeed/purchases/{paymentId}`, que es lo que
 * reconsulta el polling. La única excepción es CANCELLED, porque ahí el usuario
 * dijo explícitamente que no.
 *
 * Nada de esto cierra la orden en Tokapay: eso lo hace el backend cuando expira
 * (15 min). Y como `POST /purchases` reutiliza el pago pendiente del mismo
 * paquete, reintentar no cobra dos veces.
 */
export function useWalletPayment(): UseWalletPaymentResult {
  const { mutate } = useSWRConfig()

  const [step, setStep] = useState<PaymentStep>('idle')
  const [purchase, setPurchase] = useState<WalletPurchase | null>(null)
  const [order, setOrder] = useState<PurchaseResponseDTO | null>(null)
  const [error, setError] = useState('')

  /** `null` significa Welcome Bundle; un id, un paquete de TF. */
  const [packageId, setPackageId] = useState<string | null>(null)

  const close = useCallback(() => {
    setStep('idle')
    setPurchase(null)
    setOrder(null)
    setError('')
    setPackageId(null)
  }, [])

  const choosePack = useCallback((pack: TfPackView) => {
    setPurchase({
      name: pack.name,
      tf: pack.tf,
      bonus: pack.bonus,
      mxn: pack.mxn,
      isBundle: false,
    })
    setPackageId(pack.id)
    setError('')
    setStep('confirm')
  }, [])

  const chooseBundle = useCallback((offer: WelcomeBundleOfferDTO) => {
    setPurchase({
      name: 'Bienvenido a Toka Arena',
      tf: offer.tfAmount,
      bonus: 0,
      mxn: offer.priceMxnCents / 100,
      extras: offer.description,
      isBundle: true,
    })
    setPackageId(null)
    setError('')
    setStep('confirm')
  }, [])

  const pay = useCallback(async () => {
    setStep('paying')
    setError('')

    try {
      const created = packageId
        ? await tokaFeedApi.createPurchase(packageId)
        : await tokaFeedApi.buyWelcomeBundle()

      setOrder(created)

      const code = await openCashier(created.paymentUrl)
      if (code === PAY_RESULT.CANCELLED) {
        close()
        return
      }

      setStep('checking')
    } catch (err) {
      setError(getApiErrorMessage(err, 'No pudimos abrir el pago, inténtalo de nuevo'))
      setStep('error')
    }
  }, [close, packageId])

  const check = useCallback(async () => {
    if (!order) return

    try {
      const res = await tokaFeedApi.getPurchase(order.paymentId)

      if (res.status === 'SUCCESS') {
        setStep('done')
        return
      }
      if (res.status === 'PROCESSING') {
        return // sigue igual; el jugador puede volver a pulsar Actualizar
      }

      setError(
        res.status === 'EXPIRED'
          ? 'La orden expiró sin pagarse.'
          : 'El pago no se completó. Si crees que sí se cobró, revísalo en un momento.',
      )
      setStep('error')
    } catch (err) {
      setError(getApiErrorMessage(err, 'No pudimos consultar el pago'))
      setStep('error')
    }
  }, [order])

  // Polling mientras la caja ya se cerró y el backend no ha resuelto. Cerrar la
  // hoja cambia `step`, este efecto se limpia y el clearInterval corta las
  // peticiones: no hace falta ningún mecanismo de cancelación aparte.
  useEffect(() => {
    if (step !== 'checking' || !order) return

    const startedAt = Date.now()

    const timer = setInterval(async () => {
      try {
        const res = await tokaFeedApi.getPurchase(order.paymentId)

        if (res.status === 'SUCCESS') {
          setStep('done')
        } else if (res.status === 'FAILED') {
          setError('El pago no se completó. Si crees que sí se cobró, revísalo en un momento.')
          setStep('error')
        } else if (res.status === 'EXPIRED') {
          setError('La orden expiró sin pagarse.')
          setStep('error')
        } else if (Date.now() - startedAt > CHECK_WINDOW_MS) {
          setStep('pending')
        }
      } catch {
        // Fallo de red: se reintenta en el siguiente tick. Solo la ventana corta.
      }
    }, CHECK_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [step, order])

  // Al quedar listo, refrescar lo que cambió. El saldo se revalida en vez de
  // adivinarse: la respuesta del pago no trae el saldo nuevo, y con dinero real
  // vale más un número confirmado que uno inmediato.
  useEffect(() => {
    if (step !== 'done') return

    mutate('player')

    if (purchase?.isBundle) {
      mutate('home')
      mutate(walletKeys.welcomeBundle())
      mutate((key) => Array.isArray(key) && key[0] === 'collection.tokas')
      mutate((key) => Array.isArray(key) && key[0] === 'collection.accessories')
    }
  }, [step, purchase, mutate])

  return { step, purchase, error, choosePack, chooseBundle, pay, check, close }
}
