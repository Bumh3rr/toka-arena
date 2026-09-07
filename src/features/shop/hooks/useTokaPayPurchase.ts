import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useSWRConfig } from 'swr'
import { getApiErrorMessage } from '@/shared/api/client'
import { useToast } from '@/shared/hooks/useToast'
import { CashierUnavailableError, PAY_RESULT, paymentDriver } from '../lib/tokaPay'
import { walletKeys } from '../swr/keys'
import type { PurchaseResponseDTO, WelcomeBundleOfferDTO } from '../api/dto/tokafeed.dto'
import type { TfPackView } from './useTfPackages'

/** Qué se está comprando. */
export type PurchaseTarget =
  | { kind: 'package'; pack: TfPackView }
  | { kind: 'welcomeBundle'; offer: WelcomeBundleOfferDTO }

/**
 * Estado del flujo de compra.
 *
 * `pending` no es un fallo: el pago puede seguir vivo y acreditarse más tarde;
 * solo significa que dejamos de esperar en pantalla.
 */
export type PurchasePhase =
  | { status: 'idle' }
  | { status: 'confirm'; target: PurchaseTarget }
  | { status: 'creating'; target: PurchaseTarget }
  | { status: 'cashier'; target: PurchaseTarget; purchase: PurchaseResponseDTO }
  | { status: 'confirming'; target: PurchaseTarget; purchase: PurchaseResponseDTO }
  | { status: 'success'; target: PurchaseTarget; tfCredited: number }
  | { status: 'failed'; target: PurchaseTarget; message: string }
  | { status: 'expired'; target: PurchaseTarget }
  | { status: 'pending'; target: PurchaseTarget; purchase: PurchaseResponseDTO }

interface UseTokaPayPurchaseResult {
  phase: PurchasePhase
  /** Hay un flujo en curso: el resto de botones Comprar deben quedar deshabilitados. */
  busy: boolean
  /** Abre la confirmación previa. */
  start: (target: PurchaseTarget) => void
  /** Confirma: crea la orden, abre la caja y espera el veredicto del backend. */
  confirm: () => Promise<void>
  /** Reintenta desde cero el mismo target tras un fallo. */
  retry: () => Promise<void>
  /** Consulta suelta desde `pending`, sin reanudar el polling. */
  refresh: () => Promise<void>
  /** Corta el polling y vuelve a `idle`. */
  close: () => void
  toast: ReturnType<typeof useToast>['toast']
}

/** Cada cuánto se reconsulta el estado del pago. */
const POLL_INTERVAL_MS = 3000
/** Cuánto se espera en pantalla antes de pasar a `pending`. */
const POLL_WINDOW_MS = 90_000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** 403 (no es tuyo) y 404 (no existe) no se arreglan reintentando: cortan el polling. */
function isFatalPollError(err: unknown): boolean {
  return axios.isAxiosError(err) && (err.response?.status === 403 || err.response?.status === 404)
}

/**
 * Orquesta la compra de TokaFeed con dinero real.
 *
 * Reglas que no se negocian:
 * - La fuente de verdad es SIEMPRE `GET /purchases/{paymentId}`. El `resultCode`
 *   de la caja es informativo; el único que altera el camino es CANCELLED, que
 *   es una decisión explícita del usuario.
 * - Un solo flujo en vuelo a la vez.
 * - Cerrar el sheet corta el polling. No se cierra la orden en Tokapay: eso lo
 *   hace el backend al expirar (15 min), y mientras tanto un reintento del mismo
 *   paquete reutiliza esa misma orden en vez de crear otra.
 */
export function useTokaPayPurchase(): UseTokaPayPurchaseResult {
  const { mutate } = useSWRConfig()
  const { show, toast } = useToast()
  const [phase, setPhase] = useState<PurchasePhase>({ status: 'idle' })

  /**
   * Identifica el intento en curso. Cerrar el sheet o desmontar lo incrementa,
   * y cualquier paso asíncrono en vuelo se descarta al ver que ya no es el suyo.
   * Cumple el papel del `clearInterval` de un polling con temporizador.
   */
  const runIdRef = useRef(0)

  useEffect(() => () => { runIdRef.current += 1 }, [])

  const invalidateAfterSuccess = useCallback(
    async (target: PurchaseTarget) => {
      // El saldo se revalida, no se adivina: la respuesta del pago no trae el
      // saldo nuevo y con dinero real vale más un número confirmado.
      await mutate('player')

      if (target.kind === 'welcomeBundle') {
        await mutate((key) => Array.isArray(key) && key[0] === 'collection.tokas')
        await mutate((key) => Array.isArray(key) && key[0] === 'collection.accessories')
        await mutate('home')
        await mutate(walletKeys.welcomeBundle())
      }
    },
    [mutate],
  )

  /** Aplica al estado el veredicto del backend. */
  const applyResolved = useCallback(
    async (target: PurchaseTarget, resolved: PurchaseResponseDTO) => {
      if (resolved.status === 'SUCCESS') {
        setPhase({ status: 'success', target, tfCredited: resolved.tfToCredit })
        await invalidateAfterSuccess(target)
        return
      }

      if (resolved.status === 'EXPIRED') {
        setPhase({ status: 'expired', target })
        return
      }

      setPhase({
        status: 'failed',
        target,
        message: 'El pago no se completó. Si crees que sí se cobró, revisa en un momento.',
      })
    },
    [invalidateAfterSuccess],
  )

  /**
   * Reconsulta hasta que el backend resuelva o se agote la ventana.
   * Devuelve `null` si el intento se canceló o si se acabó el tiempo.
   */
  const poll = useCallback(
    async (paymentId: string, runId: number, deadline: number): Promise<PurchaseResponseDTO | null> => {
      while (Date.now() < deadline) {
        await sleep(POLL_INTERVAL_MS)
        if (runIdRef.current !== runId) return null

        try {
          const res = await paymentDriver.getPurchase(paymentId)
          if (runIdRef.current !== runId) return null
          if (res.status !== 'PROCESSING') return res
        } catch (err) {
          if (isFatalPollError(err)) throw err
          // Fallo de red: se reintenta en el siguiente tick. Solo la ventana corta.
        }
      }
      return null
    },
    [],
  )

  const run = useCallback(
    async (target: PurchaseTarget) => {
      const runId = runIdRef.current
      setPhase({ status: 'creating', target })

      let purchase: PurchaseResponseDTO
      try {
        purchase =
          target.kind === 'package'
            ? await paymentDriver.createPackagePurchase(
                target.pack.id,
                target.pack.tf,
                target.pack.priceMxnCents,
              )
            : await paymentDriver.createWelcomeBundlePurchase(
                target.offer.tfAmount,
                target.offer.priceMxnCents,
              )
      } catch (err) {
        if (runIdRef.current !== runId) return

        // 404: el paquete ya no existe o se desactivó -> refrescar el catálogo.
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          await mutate(walletKeys.packages())
        }
        // 400 en el bundle: ya estaba reclamado -> ocultar la tarjeta y salir.
        if (target.kind === 'welcomeBundle' && axios.isAxiosError(err) && err.response?.status === 400) {
          await mutate(walletKeys.welcomeBundle())
          show(getApiErrorMessage(err, 'Ya reclamaste esta oferta'), { variant: 'warn' })
          setPhase({ status: 'idle' })
          return
        }

        setPhase({
          status: 'failed',
          target,
          message: getApiErrorMessage(err, 'No pudimos abrir el pago, inténtalo de nuevo'),
        })
        return
      }

      if (runIdRef.current !== runId) return

      // Si el pago ya venía resuelto (orden reutilizada y confirmada entretanto),
      // no hay nada que abrir.
      if (purchase.status !== 'PROCESSING') {
        await applyResolved(target, purchase)
        return
      }

      setPhase({ status: 'cashier', target, purchase })

      let resultCode: number
      try {
        resultCode = await paymentDriver.openCashier(purchase.paymentUrl)
      } catch (err) {
        if (runIdRef.current !== runId) return
        const message =
          err instanceof CashierUnavailableError
            ? err.message
            : getApiErrorMessage(err, 'No pudimos abrir la caja de pago')
        setPhase({ status: 'failed', target, message })
        return
      }

      if (runIdRef.current !== runId) return

      // Cancelación explícita: una sola consulta por si acaso ya había pagado,
      // y si sigue pendiente se cierra sin hacerle esperar 90 segundos.
      if (resultCode === PAY_RESULT.CANCELLED) {
        try {
          const res = await paymentDriver.getPurchase(purchase.paymentId)
          if (runIdRef.current !== runId) return
          if (res.status !== 'PROCESSING') {
            await applyResolved(target, res)
            return
          }
        } catch {
          // da igual: si no se puede consultar, se trata como cancelado
        }
        if (runIdRef.current !== runId) return
        show('Pago cancelado', { variant: 'info' })
        setPhase({ status: 'idle' })
        return
      }

      setPhase({ status: 'confirming', target, purchase })

      const deadline = Math.min(purchase.expiresAtMillis, Date.now() + POLL_WINDOW_MS)

      let resolved: PurchaseResponseDTO | null
      try {
        resolved = await poll(purchase.paymentId, runId, deadline)
      } catch (err) {
        if (runIdRef.current !== runId) return
        setPhase({
          status: 'failed',
          target,
          message: getApiErrorMessage(err, 'No pudimos confirmar el pago'),
        })
        return
      }

      if (runIdRef.current !== runId) return

      if (!resolved) {
        setPhase({ status: 'pending', target, purchase })
        return
      }

      await applyResolved(target, resolved)
    },
    [applyResolved, mutate, poll, show],
  )

  const start = useCallback((target: PurchaseTarget) => {
    setPhase((prev) => (prev.status === 'idle' ? { status: 'confirm', target } : prev))
  }, [])

  const confirm = useCallback(async () => {
    if (phase.status !== 'confirm') return
    await run(phase.target)
  }, [phase, run])

  const retry = useCallback(async () => {
    if (phase.status !== 'failed' && phase.status !== 'expired') return
    await run(phase.target)
  }, [phase, run])

  const refresh = useCallback(async () => {
    if (phase.status !== 'pending') return
    const { target, purchase } = phase
    try {
      const res = await paymentDriver.getPurchase(purchase.paymentId)
      if (res.status === 'PROCESSING') {
        show('Seguimos esperando la confirmación de Toka', { variant: 'info' })
        return
      }
      await applyResolved(target, res)
    } catch (err) {
      show(getApiErrorMessage(err, 'No pudimos consultar el pago'), { variant: 'danger' })
    }
  }, [applyResolved, phase, show])

  const close = useCallback(() => {
    runIdRef.current += 1
    setPhase({ status: 'idle' })
  }, [])

  return {
    phase,
    busy: phase.status !== 'idle',
    start,
    confirm,
    retry,
    refresh,
    close,
    toast,
  }
}
