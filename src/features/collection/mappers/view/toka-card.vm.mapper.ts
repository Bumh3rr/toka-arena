import type { ColToka } from '../../types/collection.types'

export interface TokaCardViewModel {
  id: string
  nick: string
  species: ColToka['species']
  rarity: ColToka['rarity']
  fav: boolean
}

export function mapTokaToCardVM(toka: ColToka): TokaCardViewModel {
  return {
    id: toka.id,
    nick: toka.nick,
    species: toka.species,
    rarity: toka.rarity,
    fav: toka.fav,
  }
}
