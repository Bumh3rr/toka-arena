import { Suspense, lazy, type CSSProperties } from 'react'
import { Label } from '@/shared/ui/Kit'
import { RARITY_META, SPARKLE_COUNT, SPARKLE_POS } from '@/shared/constants/rarity'
import type { Rarity } from '@/shared/domain/tokagotchi'
import type { StoreItemDTO } from '../../api/dto/shop.dto'
import type { ItemAvailability } from '../../types/shop.types'
import { formatTF } from '../../lib/formatTF'
import { getEggArt, getEggPoster } from '../../lib/eggArt'
import styles from './EggCard.module.css'

/**
 * Rive entra en diferido: el runtime más el WASM pesan cerca de 2 MB y no
 * deben estar en el bundle inicial. Solo se descargan al abrir la Tienda.
 */
const EggRiveArt = lazy(() => import('./EggRiveArt'))

interface EggCardProps {
  item: StoreItemDTO
  /**
   * Sale de `getItemAvailability`, igual que en StoreItemCard. Antes había un
   * `enableBuy` propio de esta tarjeta: dos mecanismos para el mismo concepto.
   */
  availability: ItemAvailability
  onBuy: (item: StoreItemDTO) => void
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
export default function EggCard({ item, availability, onBuy }: EggCardProps) {
  const soon = availability === 'soon'
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
      className={`${styles.card} ${soon ? styles.soon : ''}`}
      style={rarityVars}
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

        {/*
          * El SVG con nido hace de respaldo del respaldo: si el chunk de Rive
          * aún no ha llegado, se ve el huevo de siempre en vez de un hueco.
          */}
        <Suspense
          fallback={
            <img src={getEggArt(rarity)} alt="" aria-hidden="true" className={styles.art} />
          }
        >
          <EggRiveArt rarity={rarity} poster={getEggPoster(rarity)} className={styles.art} />
        </Suspense>

        {soon && (
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
