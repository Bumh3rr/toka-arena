import { useState, useCallback } from 'react'
import { useSWRConfig } from 'swr'
import { usePlayer } from '@/shared/player/hooks/usePlayer'
import { useToast } from '@/shared/hooks/useToast'
import { getApiErrorMessage } from '@/shared/api/client'
import type { PlayerProfile } from '@/shared/player/data/player'
import { playerApi } from '@/shared/player/api/player.api'
import { mapTokagotchiDTO } from '@/shared/domain/mappers/tokagotchi.mapper'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import { shopApi } from '../api/shop.api'
import type { StoreItemDTO } from '../api/dto/shop.dto'

/** Resultado de una compra. `newToka` solo viene al comprar un huevo (para el revelado). */
export interface BuyResult {
  ok: boolean
  newToka?: Tokagotchi
}

interface UseBuyItemResult {
  /** Saldo TF actual del jugador. */
  tf: number
  /** Id del ítem cuya compra está en vuelo, o `null`. */
  buyingId: string | null
  /** Compra un ítem. `ok:true` si tuvo éxito; `newToka` presente si fue un huevo. */
  buy: (item: StoreItemDTO) => Promise<BuyResult>
  toast: ReturnType<typeof useToast>['toast']
}

/** Trae el Tokagotchi más reciente del jugador (el recién creado por el huevo). Best-effort. */
async function fetchNewestToka(): Promise<Tokagotchi | undefined> {
  try {
    const page = await playerApi.getMyTokagotchis(0, 1)
    const dto = page.content[0]
    return dto ? mapTokagotchiDTO(dto) : undefined
  } catch {
    return undefined
  }
}

/**
 * Orquesta la compra de un ítem de la tienda:
 * - **Gate por saldo**: no lanza la compra si `tf < precio` (el backend también valida).
 * - **Lock anti doble-submit**: una sola compra en vuelo a la vez.
 * - **Saldo optimista**: actualiza la caché `'player'` con `remainingTokaFeed` sin refetch.
 * - **Coherencia de cachés**: revalida inventario / roster según el tipo de ítem.
 */
export function useBuyItem(): UseBuyItemResult {
  const { mutate } = useSWRConfig()
  const { state } = usePlayer()
  const { show, toast } = useToast()
  const [buyingId, setBuyingId] = useState<string | null>(null)

  const tf = state.status === 'ready' ? state.data.tf : 0

  const buy = useCallback(
    async (item: StoreItemDTO): Promise<BuyResult> => {
      if (buyingId) return { ok: false }
      if (tf < item.priceInTokaFeed) {
        show('No tienes suficiente TF', { variant: 'danger' })
        return { ok: false }
      }

      setBuyingId(item.id)
      try {
        const res = await shopApi.buyItem(item.id)

        // Saldo TF actualizado sin refetch, usando remainingTokaFeed de la respuesta
        await mutate<PlayerProfile>(
          'player',
          (prev) => (prev ? { ...prev, tf: res.remainingTokaFeed } : prev),
          { revalidate: false },
        )

        // Coherencia de cachés + feedback según el tipo de ítem comprado
        if (item.itemType === 'SKIN') {
          // el accesorio nuevo aparece en el inventario del Probador
          await mutate((key) => Array.isArray(key) && key[0] === 'collection.accessories')
          show(`¡${item.displayName} comprado!`, { variant: 'celebrity' })
          return { ok: true }
        }

        if (item.itemType === 'EGG') {
          // el huevo crea un Tokagotchi nuevo -> refresca roster y home
          await mutate((key) => Array.isArray(key) && key[0] === 'collection.tokas')
          await mutate('home')
          const newToka = await fetchNewestToka()
          // si hay Toka, el revelado es el feedback; si no, toast de respaldo
          if (!newToka) show(`¡${item.displayName} comprado!`, { variant: 'celebrity' })
          return { ok: true, newToka }
        }

        show(`¡${item.displayName} comprado!`, { variant: 'celebrity' })
        return { ok: true }
      } catch (err) {
        show(getApiErrorMessage(err, 'No se pudo completar la compra'), { variant: 'danger' })
        return { ok: false }
      } finally {
        setBuyingId(null)
      }
    },
    [buyingId, tf, mutate, show],
  )

  return { tf, buyingId, buy, toast }
}
