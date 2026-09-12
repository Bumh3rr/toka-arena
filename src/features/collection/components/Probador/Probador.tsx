import { type CSSProperties } from 'react'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import type { AccessorySlot } from '@/shared/domain/accessory'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import { RARITY_META } from '@/shared/constants/rarity'
import { getSlotLabel } from '@/shared/constants/accessory'
import { getApiErrorMessage } from '@/shared/api/client'
import { useToast } from '@/shared/hooks/useToast'
import { Toast } from '@/shared/ui/Kit'
import AccSlot from '../AccSlot'
import TokaPicker from './TokaPicker'
import SlotInventory from './SlotInventory'
import { useProbador } from './useProbador'
import styles from './Probador.module.css'

interface ProbadorProps {
  roster: Tokagotchi[]
  activeTokaId: string
  onEquipChange: () => void | Promise<void>
}

// Slots del probador en orden de fila. Cara/Cuello aún no tienen accesorios.
const SLOTS: { slot: AccessorySlot; future?: boolean }[] = [
  { slot: 'HEAD' },
  { slot: 'FACE' },
  { slot: 'BACK' },
  { slot: 'NECK', future: true },
]

export default function Probador({ roster, activeTokaId, onEquipChange }: ProbadorProps) {
  const { show, toast } = useToast()
  const p = useProbador({ roster, activeTokaId, onEquipChange })

  if (roster.length === 0) {
    return <p className={styles.empty}>No tienes Tokagotchis todavía.</p>
  }

  const toka = p.selectedToka ?? roster[0]
  const meta = RARITY_META[toka.rarity]
  const slotMap = Object.fromEntries(p.equippedForCanvas.map(e => [e.slot, e]))

  const doEquip = async (accId: string, displayName: string) => {
    try {
      await p.equip(accId)
      show(`Equipado: ${displayName}`, { variant: 'celebrity' })
    } catch (err) {
      show(getApiErrorMessage(err, 'No se pudo equipar'), { variant: 'danger' })
    }
  }
  const doUnequip = async (accId: string, slotLabel: string) => {
    try {
      await p.unequip(accId)
      show(`Quitado de ${slotLabel}`, { variant: 'info' })
    } catch (err) {
      show(getApiErrorMessage(err, 'No se pudo quitar'), { variant: 'danger' })
    }
  }

  return (
    <section className={styles.probador} aria-label="Probador de accesorios">
      <TokaPicker
        roster={roster}
        activeTokaId={activeTokaId}
        selectedTokaId={p.selectedTokaId}
        onSelect={p.selectToka}
      />

      <div className={styles.stage} style={{ '--glow-soft': meta.soft } as CSSProperties}>
        <div className={styles.glow} aria-hidden="true" />
        {/* key fuerza remount al cambiar de especie (canvas no es reactivo a species) */}
        <div key={toka.id} className={styles.canvasPop}>
          <TokagotchiCanvas
            width={188}
            height={188}
            species={toka.species}
            accessories={p.equippedForCanvas}
            animacionActual="idle"
          />
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.slots}>
          {SLOTS.map(({ slot, future }) => (
            <AccSlot
              key={slot}
              label={getSlotLabel(slot)}
              acc={slotMap[slot]}
              future={future}
              selected={!future && p.selectedSlot === slot}
              onClick={() => p.selectSlot(slot)}
            />
          ))}
        </div>

        <SlotInventory
          slotLabel={getSlotLabel(p.selectedSlot)}
          groups={p.slotGroups}
          equippedHereId={p.equippedHereId}
          actionLoading={p.actionLoading}
          loading={p.inventoryLoading}
          hasNext={p.hasNext}
          error={p.inventoryError}
          onLoadMore={p.loadMore}
          onReload={p.reloadInventory}
          onEquip={doEquip}
          onUnequip={(accId) => doUnequip(accId, getSlotLabel(p.selectedSlot))}
        />
      </div>

      {toast && <Toast {...toast} />}
    </section>
  )
}
