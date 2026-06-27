/**
const favByTokaId = new Map<string, boolean>()

export interface FavoritesApi {
  setFavorite(tokaId: string, favorite: boolean): Promise<void>
  getFavorite(tokaId: string): boolean
}

export const favoritesApi: FavoritesApi = {
  async setFavorite(tokaId, favorite) {
    favByTokaId.set(tokaId, favorite)
  },
  getFavorite(tokaId) {
    return favByTokaId.get(tokaId) ?? false
  },
}
*/