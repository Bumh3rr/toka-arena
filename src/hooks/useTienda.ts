import { useState } from 'react'
import type { ItemTienda, PaqueteWallet } from '../types/tienda'
import { ITEMS_TIENDA_MOCK, PAQUETES_WALLET_MOCK } from '../constants/tienda'

export type TiendaTab = 'tf' | 'wallet'

export function useTienda() {
  const [tab, setTab] = useState<TiendaTab>('tf')
  // TODO: reemplazar con llamada a API
  const items: ItemTienda[] = ITEMS_TIENDA_MOCK
  const paquetes: PaqueteWallet[] = PAQUETES_WALLET_MOCK

  const comprarItem = (item: ItemTienda) => {
    // TODO: llamar API POST /tienda/comprar
    console.log('Comprando item:', item)
  }

  const comprarPaquete = (paquete: PaqueteWallet) => {
    // TODO: llamar API Toka Wallet
    console.log('Comprando paquete:', paquete)
  }

  return { tab, setTab, items, paquetes, comprarItem, comprarPaquete }
}