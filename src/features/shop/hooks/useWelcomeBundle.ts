import useSWR from 'swr'
import { tokaFeedApi } from '../api/tokafeed.api'
import { walletKeys } from '../swr/keys'
import type { WelcomeBundleOfferDTO } from '../api/dto/tokafeed.dto'

interface UseWelcomeBundleResult {
  /** `undefined` mientras carga o si falló. */
  offer: WelcomeBundleOfferDTO | undefined
  isLoading: boolean
  error: unknown
  reload: () => void
}

/**
 * Oferta de bienvenida, única por cuenta.
 *
 * `offer.available === false` significa que el jugador ya la reclamó: la
 * tarjeta no debe mostrarse. Un fallo de red tampoco muestra la tarjeta —
 * es preferible no ofrecer que ofrecer algo que el backend va a rechazar.
 */
export function useWelcomeBundle(): UseWelcomeBundleResult {
  const { data, error, isLoading, mutate } = useSWR(walletKeys.welcomeBundle(), () =>
    tokaFeedApi.getWelcomeBundleOffer()
  )

  return { offer: data, isLoading, error, reload: () => mutate() }
}
