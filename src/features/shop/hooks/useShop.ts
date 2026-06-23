import { useState } from 'react'
import type { ItemTienda, PaqueteWallet } from '../types/shop'
import { ITEMS_TIENDA_MOCK, PAQUETES_WALLET_MOCK } from '../constants/shop'
import { shopService } from '../services/shopService'

export type TiendaTab = 'tf' | 'wallet'

export function useTienda() {
  const [tab, setTab] = useState<TiendaTab>('tf')
  const [tf, setTf] = useState(1000)
  const [itemsComprados, setItemsComprados] = useState<string[]>([])
  const [comprando, setComprando] = useState<string | null>(null)
  const [exitoId, setExitoId] = useState<string | null>(null)

  const paquetes: PaqueteWallet[] = PAQUETES_WALLET_MOCK


  // Items filtrados — ocultar los que ya tiene
  const items: ItemTienda[] = ITEMS_TIENDA_MOCK.filter(
    item => !itemsComprados.includes(item.id)
  )

  const comprarItem = async (item: ItemTienda) => {
    if (comprando) return
    if (tf < item.precio) return

    setComprando(item.id)
    try {
      await shopService.comprarAccesorio(item.id)

      // Animación de éxito
      setExitoId(item.id)
      setTimeout(() => setExitoId(null), 1000)

      // Actualizar TF y marcar como comprado
      setTf(prev => prev - item.precio)
      setItemsComprados(prev => [...prev, item.id])
    } catch (err) {
      console.error('Error comprando accesorio:', err)
    } finally {
      setComprando(null)
    }
  }

  const comprarPaquete = (paquete: PaqueteWallet) => {
    // TODO: integrar Toka Wallet SDK
    console.log('Comprando paquete:', paquete)
  }

  return {
    tab, setTab,
    tf, items, paquetes,
    comprarItem, comprarPaquete,
    comprando, exitoId
  }
}