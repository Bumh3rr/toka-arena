/** 
export interface CollectionApi {
  getCollection(page: number, size: number): Promise<CollectionResponseDTO>
  activate(tokaId: string): Promise<void>
  toggleFav(tokaId: string, fav: boolean): Promise<void>
}

const BASE_ACCESSORIES: ColAcc[] = [
  { id: 'acc_helmet', name: 'Casco',      slot: 'cabeza', owned: 0, equipped: [], locked: false, code: 'HELMET',     image: '/assets/accesorios/casco.png' },
  { id: 'acc_crown',  name: 'Corona',     slot: 'cabeza', owned: 0, equipped: [], locked: false, code: 'CROWN',      image: '/assets/accesorios/corona.png' },
  { id: 'acc_hat',    name: 'Sombrero',   slot: 'cabeza', owned: 0, equipped: [], locked: false, code: 'HAT',        image: '/assets/accesorios/sombrero.png' },
  { id: 'acc_cape',   name: 'Super Capa', slot: 'cuerpo', owned: 0, equipped: [], locked: false, code: 'SUPER_CAPE', image: '/assets/accesorios/capa.png' },
]

export const collectionApi: CollectionApi = realCollectionApi
*/