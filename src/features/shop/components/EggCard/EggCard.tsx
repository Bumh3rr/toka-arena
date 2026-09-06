import type { CSSProperties } from 'react'
import { Label } from '@/shared/ui/Kit'
import { RARITY_META, SPARKLE_COUNT, SPARKLE_POS } from '@/shared/constants/rarity'
import type { Rarity } from '@/shared/domain/tokagotchi'
import type { StoreItemDTO } from '../../api/dto/shop.dto'
import { formatTF } from '../../lib/formatTF'
import styles from './EggCard.module.css'

/**
 * Ilustración por rareza. Cada huevo viene en su nido.
 *
 * LEGENDARY no se vende en la tienda (`ShopEggRarity` solo tiene COMMON, RARE
 * y EPIC); la entrada existe por defensa, para no romper si el backend lo
 * añadiera antes que el arte.
 */
const EGG_ART: Record<Rarity, string> = {
  COMMON: '/assets/ui/egg/egg_common.svg',
  RARE: '/assets/ui/egg/egg_rare.svg',
  EPIC: '/assets/ui/egg/egg_epic.svg',
  LEGENDARY: '/assets/ui/egg/egg_epic.svg',
}

interface EggCardProps {
  item: StoreItemDTO
  onBuy: (item: StoreItemDTO) => void
  enableBuy?: boolean
}

/**
 * Huevo de la tienda.
 *
 * Comparte estructura con `StoreItemCard` a propósito — mismo pozo oscuro,
 * mismo precio de display — para que la tienda se lea como una sola rejilla.
 * Lo que cambia es que aquí la rareza es el eje: tiñe el resplandor del pozo
 * y decide cuántos destellos lleva.
 *
 * No hay cinta de rareza: el `displayName` del backend ya dice "Huevo Raro",
 * así que una etiqueta al lado repetiría la misma palabra.
 */
export default function EggCard({ item, onBuy, enableBuy = true }: EggCardProps) {
  const rarity = (item.eggRarity ?? 'COMMON') as Rarity
  const meta = RARITY_META[rarity]
  const sparkles = SPARKLE_POS.slice(0, SPARKLE_COUNT[rarity])

  const rarityVars = {
    '--egg-glow': meta.soft,
    '--egg-ring': meta.ring,
  } as CSSProperties

  return (
    <button
      type="button"
      className={`${styles.card} ${enableBuy ? '' : styles.soon}`}
      style={rarityVars}
      disabled={!enableBuy}
      onClick={() => onBuy(item)}
      aria-label={
        enableBuy
          ? `Comprar ${item.displayName} por ${formatTF(item.priceInTokaFeed)} TF`
          : `${item.displayName} — próximamente`
      }
    >
      <span className={styles.name}>{item.displayName}</span>

      <span className={styles.window}>
        {/* Sobre el pozo oscuro el tinte de rareza sí se lee; en crema se perdía */}
        <span className={styles.glow} aria-hidden="true" />

        {sparkles.map((pos, i) => (
          <span
            key={i}
            className={styles.spark}
            aria-hidden="true"
            style={{ ...pos, animationDelay: `${i * 0.45}s` }}
          />
        ))}

        <img src={EGG_ART[rarity]} alt="" aria-hidden="true" className={styles.art} />

        {!enableBuy && (
          <span className={styles.soonBadge}>
            <Label size="xs" variant="warm" look="solid">Próx.</Label>
          </span>
        )}
      </span>

      <span className={styles.price}>
        <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.coin} />
        <span className={styles.priceValue}>{formatTF(item.priceInTokaFeed)}</span>
      </span>
    </button>
  )
}
