import { useState } from 'react'
import { Toast } from '@/shared/ui/Kit'
import Loading from '@/shared/ui/Loading/Loading'
import PageError from '@/shared/ui/Error/Error'
import { getApiErrorMessage } from '@/shared/api/client'
import { useStoreCatalog } from '../../hooks/useStoreCatalog'
import { useBuyItem } from '../../hooks/useBuyItem'
import { getItemAvailability, isGroupVisible } from '../../lib/shopCatalog'
import type { StoreFilter } from '../../types/shop.types'
import type { StoreItemDTO } from '../../api/dto/shop.dto'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import SectionDivider from '../../components/SectionDivider/SectionDivider'
import StoreItemCard from '../../components/StoreItemCard/StoreItemCard'
import EggCard from '../../components/EggCard/EggCard'
import SpecialCard from '../../components/SpecialCard/SpecialCard'
import BuyConfirmSheet from '../../components/BuyConfirmSheet/BuyConfirmSheet'
import EggRevealOverlay from '../../components/EggRevealOverlay/EggRevealOverlay'
import styles from './StoreSection.module.css'

const CHIPS: { key: StoreFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'acc', label: 'Accesorios' },
  { key: 'eggs', label: 'Huevos' },
  { key: 'specials', label: 'Especiales' },
]

export default function StoreSection() {
  const { groups, isLoading, error, reload } = useStoreCatalog()
  const { tf, buyingId, buy, toast } = useBuyItem()

  const [filter, setFilter] = useState<StoreFilter>('all')
  const [selected, setSelected] = useState<StoreItemDTO | null>(null)
  const [revealToka, setRevealToka] = useState<Tokagotchi | null>(null)

  if (isLoading) {
    return <Loading text="Cargando tienda..." />
  }

  if (error) {
    return <PageError message={getApiErrorMessage(error, 'Error al cargar la tienda')} onRetry={reload} />
  }

  const handleConfirm = async () => {
    if (!selected) return
    const res = await buy(selected)
    if (res.ok) {
      if (selected.itemType === 'EGG' && res.newToka) setRevealToka(res.newToka)
      setSelected(null)
    }
  }

  return (
    <>
      <div className={styles.chips} role="group" aria-label="Filtros de la tienda">
        {CHIPS.map((c) => (
          <button
            key={c.key}
            className={`${styles.chip} ${filter === c.key ? styles.chipOn : ''}`}
            onClick={() => setFilter(c.key)}
          >
            
            {c.label}
          </button>
        ))}
      </div>

      {isGroupVisible(filter, 'accessories') && groups.accessories.length > 0 && (
        <section>
          <SectionDivider>Accesorios</SectionDivider>
          <div className={styles.grid}>
            {groups.accessories.map((item) => (
              <StoreItemCard
                key={item.id}
                item={item}
                availability={getItemAvailability(item)}
                onBuy={setSelected}
              />
            ))}
          </div>
        </section>
      )}

      {isGroupVisible(filter, 'eggs') && groups.eggs.length > 0 && (
        <section>
          <SectionDivider>Huevos</SectionDivider>
          <div className={styles.eggGrid}>
            {groups.eggs.map((item) => (
              <EggCard key={item.id} item={item} onBuy={setSelected} enableBuy={false} />
            ))}
          </div>
        </section>
      )}

      {isGroupVisible(filter, 'specials') && groups.specials.length > 0 && (
        <section>
          <SectionDivider>Especiales</SectionDivider>
          <div className={styles.hscroll}>
            {groups.specials.map((item) => (
              <SpecialCard key={item.id} item={item} onBuy={setSelected} enableBuy={false} />
            ))}
          </div>
        </section>
      )}

      {selected && (
        <BuyConfirmSheet
          item={selected}
          tf={tf}
          buying={buyingId === selected.id}
          onConfirm={handleConfirm}
          onClose={() => setSelected(null)}
        />
      )}

      {revealToka && (
        <EggRevealOverlay tokagotchi={revealToka} onClose={() => setRevealToka(null)} />
      )}

      {toast && <Toast {...toast} />}
    </>
  )
}
