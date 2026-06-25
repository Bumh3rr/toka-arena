import type { ColToka } from '../../types/collection.types'

export interface TokaDetailViewModel {
  id: string
  nick: string
  cp: number
  stats: ColToka['stats']
  abilities: ColToka['abilities']
}

export function mapTokaToDetailVM(toka: ColToka): TokaDetailViewModel {
  return {
    id: toka.id,
    nick: toka.nick,
    cp: toka.cp,
    stats: toka.stats,
    abilities: toka.abilities,
  }
}
