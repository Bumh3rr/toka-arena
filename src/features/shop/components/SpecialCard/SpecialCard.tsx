import type { CSSProperties } from 'react'
import { Label } from '@/shared/ui/Kit'
import type { StoreItemDTO } from '../../api/dto/shop.dto'
import { formatTF } from '../../lib/formatTF'
import ItemGlyph from '../ItemGlyph'
import styles from './SpecialCard.module.css'

/**
 * Acento del medallón por tipo.
 *
 * Son los colores propios de los iconos del UIKit — el escudo nace verde y el
 * rayo naranja, los mismos que usa StatsRow para DEF y ATK. Con un tinte
 * distinto, el halo y el icono se peleaban.
 */
const TONE: Record<string, string> = {
  EVOLUTION_SHIELD: 'var(--green)',
  BOOSTER: '#F08A4B',
}

interface SpecialCardProps {
  item: StoreItemDTO
  onBuy: (item: StoreItemDTO) => void
  enableBuy?: boolean
}

/**
 * Ítem especial de la tienda.
 *
 * A diferencia de accesorios y huevos, estos no tienen ilustración: el peso lo
 * llevan el icono, el nombre y la descripción. Por eso la tarjeta va a lo ancho
 * en vez de en rejilla — la descripción necesita renglón, y con dos ítems un
 * scroll horizontal obligaba a desplazar para ver el segundo.
 *
 * El medallón conserva el pozo oscuro del resto de la tienda para que la
 * sección no se sienta de otro juego. El icono sale de `ItemGlyph` (rayo para
 * el booster, escudo para el shield): con un icono genérico en ambos, las dos
 * tarjetas quedaban indistinguibles salvo por el texto.
 */
export default function SpecialCard({ item, onBuy, enableBuy = true }: SpecialCardProps) {
  const tone = TONE[item.itemType] ?? 'var(--gold)'

  return (
    <button
      type="button"
      className={`${styles.card} ${enableBuy ? '' : styles.soon}`}
      style={{ '--tone': tone } as CSSProperties}
      disabled={!enableBuy}
      onClick={() => onBuy(item)}
      aria-label={
        enableBuy
          ? `Comprar ${item.displayName} por ${formatTF(item.priceInTokaFeed)} TF`
          : `${item.displayName} — próximamente`
      }
    >
      <span className={styles.well}>
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.glyph} aria-hidden="true">
          <ItemGlyph itemType={item.itemType} />
        </span>
      </span>

      <span className={styles.info}>
        <span className={styles.name}>{item.displayName}</span>
        <span className={styles.desc}>{item.description}</span>

        <span className={styles.price}>
          <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.coin} />
          <span className={styles.priceValue}>{formatTF(item.priceInTokaFeed)}</span>
        </span>
      </span>

      {!enableBuy && (
        <span className={styles.soonBadge}>
          <Label size="xs" variant="warm" look="solid">Próx.</Label>
        </span>
      )}
    </button>
  )
}
