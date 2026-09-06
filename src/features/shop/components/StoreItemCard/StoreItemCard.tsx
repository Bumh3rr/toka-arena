import { Label } from '@/shared/ui/Kit'
import { getAccessoryImageSvgSrc } from '@/shared/game/assets'
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

/**
 * Ítem de la tienda.
 *
 * La rejilla enseña EL ACCESORIO, no un tokagotchi llevándolo: aquí el
 * producto es el objeto, y ponerle un toka alrededor lo encogía hasta
 * volverlo el detalle pequeño de la tarjeta. Cómo queda puesto se ve al
 * tocar, en el BuyConfirmSheet, que ya renderiza un tokagotchi vivo con el
 * accesorio y permite cambiar de especie.
 *
 * El arte vive en una ventana oscura: sobre el crema de la tarjeta, una caja
 * crema no daba contraste y el dibujo se diluía. Y el precio es el texto más
 * grande, en blanco con contorno, porque antes era una pastilla de 10 px y
 * la tarjeta se leía apagada.
 *
 * La tarjeta entera dispara la compra — el paso de confirmación es el sheet.
 */
export default function StoreItemCard({ item, availability, onBuy }: StoreItemCardProps) {
  const soon = availability === 'soon'
  const art = item.accessoryType ? getAccessoryImageSvgSrc(item.accessoryType) : null

  return (
    <button
      type="button"
      className={`${styles.card} ${soon ? styles.soon : ''}`}
      disabled={soon}
      onClick={() => onBuy(item)}
      aria-label={
        soon
          ? `${item.displayName} — próximamente`
          : `Comprar ${item.displayName} por ${formatTF(item.priceInTokaFeed)} TF`
      }
    >
      <span className={styles.name}>{item.displayName}</span>

      <span className={styles.window}>
        {art ? (
          <img src={art} alt="" aria-hidden="true" className={styles.art} />
        ) : (
          <span className={styles.glyph} aria-hidden="true">
            <ItemGlyph itemType={item.itemType} />
          </span>
        )}

        {soon && (
          <span className={styles.soonBadge}>
            <Label size="xs" variant="warm" look="solid">Próx.</Label>
          </span>
        )}
      </span>

      {!soon && (
        <span className={styles.price}>
          <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.coin} />
          <span className={styles.priceValue}>{formatTF(item.priceInTokaFeed)}</span>
        </span>
      )}
    </button>
  )
}
