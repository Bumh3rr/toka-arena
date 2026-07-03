import type { TokagotchiDTO } from '@/shared/api/dto/tokagotchi.dto'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import { mapTokagotchiDTO } from '@/shared/domain/mappers/tokagotchi.mapper'

export function mapTokaDtoListToColRoster(content: TokagotchiDTO[]): Tokagotchi[] {
  return content.map(mapTokagotchiDTO)
}
