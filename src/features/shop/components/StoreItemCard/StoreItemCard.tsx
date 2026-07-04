import { Card, Button, Label } from '@/shared/ui/Kit'
import { getAccessoryImageSrc } from '@/shared/game/assets'
import { getSlotLabel } from '@/shared/constants/accessory'
import type { AccessorySlot } from '@/shared/domain/accessory'
import type { StoreItemDTO } from '../../api/dto/shop.dto'
import type { ItemAvailability } from '../../types/shop.types'
import { formatTF } from '../../lib/formatTF'
import ItemGlyph from '../ItemGlyph'
import styles from './StoreItemCard.module.css'

interface StoreItemCardProps {
  item: StoreItemDTO
  availability: ItemAvailability
  onBuy: (item: StoreItemDTO) => void
}

export default function StoreItemCard({ item, availability, onBuy }: StoreItemCardProps) {
  const soon = availability === 'soon'
  const imgSrc = item.accessoryType ? getAccessoryImageSrc(item.accessoryType) : null

  return (
    <Card variant="cream" padding="sm" shadow="md" className={soon ? styles.soon : ''}>
      <div className={styles.imgwrap}>
        {imgSrc ? (
          <img src={imgSrc} alt="" aria-hidden="true" className={styles.img} />
        ) : (
          <span className={styles.glyph} aria-hidden="true">
            <ItemGlyph itemType={item.itemType} />
          </span>
        )}

        {item.slot && (
          <span className={styles.slot}>
            <Label size="xs" variant="blue" look="solid">
              {getSlotLabel(item.slot as AccessorySlot)}
            </Label>
          </span>
        )}

        {soon && (
          <span className={styles.soonBadge}>
            <Label size="xs" variant="warm" look="solid">
              Próx.
            </Label>
          </span>
        )}
      </div>

      <div className={styles.name}>{item.displayName}</div>

      {soon ? (
        <Button variant="cream" size="sm" fullWidth disabled>
          Próximamente
        </Button>
      ) : (
        <>
          <div className={styles.price}>
            <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.tfIcon} />
            {formatTF(item.priceInTokaFeed)} TF
          </div>
          <Button variant="green" size="sm" fullWidth onClick={() => onBuy(item)}>
            Comprar
          </Button>
        </>
      )}
    </Card>
  )
}
