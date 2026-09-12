import { IcImage, IcBolt, IcShield } from '@/shared/ui/Icons/Icons'
import type { StoreItemDTO } from '../api/dto/shop.dto'

/**
 * Icono de respaldo para ítems sin imagen de accesorio (huevos, boosters, escudos).
 * Usa iconos del UIKit — nunca emojis.
 */
export default function ItemGlyph({ itemType }: { itemType: StoreItemDTO['itemType'] }) {
  switch (itemType) {
    case 'BOOSTER':
      return <IcBolt />
    case 'EVOLUTION_SHIELD':
      return <IcShield />
    default:
      return <IcImage />
  }
}
