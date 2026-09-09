import { useMemo } from 'react'
import useSWR from 'swr'
import { tokaFeedApi } from '../api/tokafeed.api'
import { walletKeys } from '../swr/keys'
import {
  DEFAULT_TF_PACK_ART_SPEC,
  TF_PACK_ART_SPEC,
  type TfPackArt,
  type TfPackFlair,
} from '../lib/walletPacks'

/** Un paquete listo para pintar: datos del backend + arte local. */
export interface TfPackView {
  id: string
  name: string
  /** TF total acreditado (base + bonus). */
  tf: number
  /** TF extra de bonus (0 si no aplica). */
  bonus: number
  /** Precio en pesos, ya convertido desde centavos. */
  mxn: number
  /** Precio en centavos, tal como lo maneja el backend. */
  priceMxnCents: number
  art: TfPackArt
  artSize: number
  flair: TfPackFlair
  popular: boolean
}

interface UseTfPackagesResult {
  packs: TfPackView[]
  isLoading: boolean
  error: unknown
  reload: () => void
}

const EMPTY: TfPackView[] = []

/**
 * Catálogo de paquetes de TF comprables con dinero real.
 *
 * El backend manda el catálogo ya ordenado por `sortOrder`; aquí solo se le
 * pega el arte, buscándolo por `displayName`.
 */
export function useTfPackages(): UseTfPackagesResult {
  const { data, error, isLoading, mutate } = useSWR(walletKeys.packages(), () =>
    tokaFeedApi.getPackages()
  )

  const packs = useMemo<TfPackView[]>(() => {
    if (!data) return EMPTY
    return data.map((dto) => {
      const spec = TF_PACK_ART_SPEC[dto.displayName] ?? DEFAULT_TF_PACK_ART_SPEC
      return {
        id: dto.id,
        name: dto.displayName,
        tf: dto.totalTf,
        bonus: dto.tfBonus,
        mxn: dto.priceMxnCents / 100,
        priceMxnCents: dto.priceMxnCents,
        art: spec.art,
        artSize: spec.artSize,
        flair: spec.flair,
        popular: spec.popular ?? false,
      }
    })
  }, [data])

  return { packs, isLoading, error, reload: () => mutate() }
}
