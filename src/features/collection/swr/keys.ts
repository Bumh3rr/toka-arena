import type { ColFilter } from '../types/collection.types'

export const collectionKeys = {
  tokas: (page: number, size: number, filter: ColFilter) => ['collection.tokas', page, size, filter] as const,
  accessories: () => ['collection.accessories'] as const,
  reactions: (page = 0) => ['collection.reactions', page] as const,
}
