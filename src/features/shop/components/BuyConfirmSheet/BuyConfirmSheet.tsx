import { useMemo, useState } from 'react'
import BottomSheet from '@/shared/ui/Sheet/BottomSheet/BottomSheet'
import { Button, Label, IconButton } from '@/shared/ui/Kit'
import { IcDice } from '@/shared/ui/Icons/Icons'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import { getAccessoryImageSrc } from '@/shared/game/assets'
import { getSlotLabel } from '@/shared/constants/accessory'
import { getRenderBinding } from '@/shared/render/accessoryManifest'
import type { AccessorySlot, EquippedAccessory } from '@/shared/domain/accessory'
import type { Species } from '@/shared/domain/tokagotchi'
import type { StoreItemDTO } from '../../api/dto/shop.dto'
import { formatTF } from '../../lib/formatTF'
import ItemGlyph from '../ItemGlyph'
import styles from './BuyConfirmSheet.module.css'

const SPECIES: Species[] = ['TOFU', 'MOCHI', 'HANA']
const pickRandom = (exclude?: Species): Species => {
  const pool = exclude ? SPECIES.filter((s) => s !== exclude) : SPECIES
  return pool[Math.floor(Math.random() * pool.length)]
}

interface BuyConfirmSheetProps {
  item: StoreItemDTO
  tf: number
  buying: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function BuyConfirmSheet({ item, tf, buying, onConfirm, onClose }: BuyConfirmSheetProps) {
  const [species, setSpecies] = useState<Species>(() => pickRandom())

  const enough = tf >= item.priceInTokaFeed
  const remaining = Math.max(0, tf - item.priceInTokaFeed)
  const imgSrc = item.accessoryType ? getAccessoryImageSrc(item.accessoryType) : null

  // Accesorio para vestir al Tokagotchi de la vista previa (solo si es renderizable).
  const previewAcc = useMemo<EquippedAccessory[]>(() => {
    if (!item.accessoryType) return []
    const binding = getRenderBinding(item.accessoryType)
    if (!binding) return []
    return [
      {
        id: 'preview',
        type: item.accessoryType,
        slot: (item.slot ?? 'HEAD') as AccessorySlot,
        displayIndex: binding.displayIndex,
      },
    ]
  }, [item.accessoryType, item.slot])

  const canPreview = previewAcc.length > 0

  return (
    <BottomSheet title="Confirmar compra" onClose={onClose}>
      <div className={styles.body}>
        {canPreview ? (
          <div className={styles.stage}>
            <Label size="xs" variant="cream" look="soft" className={styles.previewTag}>
              Vista previa
            </Label>
            <IconButton
              size={34}
              variant="warm"
              onClick={() => setSpecies((prev) => pickRandom(prev))}
              ariaLabel="Cambiar Tokagotchi"
              className={styles.shuffle}
            >
              <IcDice />
            </IconButton>

            <span className={styles.spotlight} aria-hidden="true" />
            <div className={styles.canvasWrap}>
              <TokagotchiCanvas
                key={species}
                species={species}
                accessories={previewAcc}
                width={168}
                height={168}
                animacionActual="idle"
              />
            </div>
            <span className={styles.pedestal} aria-hidden="true" />
          </div>
        ) : (
          <div className={styles.thumb}>
            {imgSrc ? (
              <img src={imgSrc} alt="" aria-hidden="true" className={styles.thumbImg} />
            ) : (
              <span className={styles.thumbGlyph} aria-hidden="true">
                <ItemGlyph itemType={item.itemType} />
              </span>
            )}
          </div>
        )}

        <div className={styles.name}>{item.displayName}</div>

        {item.slot && (
          <Label size="xs" variant="blue" look="solid">
            {getSlotLabel(item.slot as AccessorySlot)}
          </Label>
        )}

        <div className={styles.price}>
          <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.tfIcon} />
          {formatTF(item.priceInTokaFeed)} TF
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.row}>
          <span>Saldo actual</span>
          <span className={styles.rowVal}>
            <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.tfIconSm} />
            {formatTF(tf)} TF
          </span>
        </div>
        <div className={styles.row}>
          <span>Saldo restante</span>
          <span className={`${styles.rowVal} ${enough ? styles.rowValOk : styles.rowValNeg}`}>
            <img src="/assets/ui/tf/tf.svg" alt="" aria-hidden="true" className={styles.tfIconSm} />
            {formatTF(remaining)} TF
          </span>
        </div>

        {!enough && <div className={styles.err}>No tienes suficiente TF</div>}

        <Button variant="green" size="lg" fullWidth disabled={!enough || buying} onClick={onConfirm}>
          {buying ? 'Comprando...' : 'Confirmar compra'}
        </Button>
        <Button variant="cream" size="md" fullWidth disabled={buying} onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </BottomSheet>
  )
}
