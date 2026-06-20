import { useState } from 'react'
import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet'
import TokaAvatar from '@/shared/ui/TokaAvatar/TokaAvatar'
import { IcCheck, IcChevronDown } from '@/shared/ui/Icons/Icons'
import type { TokagotchiActive } from '@/shared/domain/tokagotchi'
import { RARITY_META } from '@/shared/constants/rarity'
import { tokagotchiService } from '@/shared/services/tokagotchiService'
import styles from './styles/CollectionModal.module.css'

interface CollectionModalProps {
  roster: TokagotchiActive[]
  activeId: number
  onActivate: (id: number) => void
  onClose: () => void
}

type SortKey = 'especie' | 'rareza' | 'favoritos'

export default function CollectionModal({ roster, activeId, onActivate, onClose }: CollectionModalProps) {
  const [sort, setSort] = useState<SortKey>('especie')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [activating, setActivating] = useState<number | null>(null)

  const handleActivate = async (id: number) => {
    if (id === activeId) return
    setActivating(id)
    try {
      await tokagotchiService.activar(id)
      onActivate(id)
    } catch (err) {
      console.error('Error activando tokagotchi:', err)
    } finally {
      setActivating(null)
    }
  }

  const groups = roster.reduce<Record<string, { nombre: string; especie: string; items: TokagotchiActive[] }>>((acc, t) => {
    const key = t.name
    if (!acc[key]) acc[key] = { nombre: t.name, especie: t.species, items: [] }
    acc[key].items.push(t)
    return acc
  }, {})

  const rarOrder = (r: TokagotchiActive) => RARITY_META[r.rarity].order
  const list = Object.values(groups)
  list.forEach(g => { g.items.sort((a, b) => rarOrder(b) - rarOrder(a)) })

  if (sort === 'rareza') {
    list.sort((a, b) => rarOrder(b.items[0]) - rarOrder(a.items[0]) || a.nombre.localeCompare(b.nombre))
  } else {
    list.sort((a, b) => a.especie.localeCompare(b.especie) || a.nombre.localeCompare(b.nombre))
  }

  const quick = roster.filter(t => t.id === activeId || roster.indexOf(t) < 6)

  return (
    <BottomSheet title="Cambiar Tokagotchi" onClose={onClose}>
      <div className={styles.sub}>Acceso rápido</div>
      <div className={styles.quickStrip}>
        {quick.map(t => {
          const rar = RARITY_META[t.rarity]
          const isActive = t.id === activeId
          return (
            <button key={t.id} className={`${styles.qChip} ${isActive ? styles.qActive : ''}`}
              onClick={() => handleActivate(t.id)}>
              <div className={styles.qAv}>
                <TokaAvatar tokagotchi={t} size={54} isActive={isActive} />
                {isActive && <span className={styles.qCheck}><IcCheck /></span>}
              </div>
              <span className={styles.qNick}>{t.name}</span>
              <span className={styles.qRar} style={{ color: rar.ring }}>{rar.label}</span>
            </button>
          )
        })}
      </div>
      <div className={styles.divider} />

      <div className={styles.sub}>Toda la colección <span className={styles.count}>({roster.length})</span></div>
      <div className={styles.filters}>
        {(['especie', 'rareza', 'favoritos'] as SortKey[]).map(k => (
          <button key={k} className={`${styles.filter} ${sort === k ? styles.filterOn : ''}`}
            onClick={() => setSort(k)}>
            {k === 'especie' ? 'Especie' : k === 'rareza' ? 'Rareza' : 'Favoritos'}
          </button>
        ))}
      </div>

      {list.map(g => {
        const isOpen = !!open[g.nombre]
        return (
          <div key={g.nombre} className={`${styles.deck} ${isOpen ? styles.deckOpen : ''}`}>
            <div className={styles.deckHead} onClick={() => setOpen(o => ({ ...o, [g.nombre]: !o[g.nombre] }))}>
              <div className={styles.deckStack}>
                {g.items.slice(0, 3).map((it, i) => (
                  <div key={it.id} style={{ position: 'absolute', top: 0, left: i * 10, zIndex: 3 - i }}>
                    <TokaAvatar tokagotchi={it} size={46} />
                  </div>
                ))}
              </div>
              <div className={styles.deckInfo}>
                <div className={styles.deckName}>{g.nombre} <span className={styles.deckCount}>×{g.items.length}</span></div>
                <div className={styles.deckSub}>{g.especie}</div>
              </div>
              <div className={styles.deckChev}><IcChevronDown /></div>
            </div>
            <div className={styles.deckItems}>
              {g.items.map(it => {
                const rar = RARITY_META[it.rarity]
                const isActive = it.id === activeId
                return (
                  <div key={it.id} className={styles.colItem}>
                    <TokaAvatar tokagotchi={it} size={44} isActive={isActive} />
                    <div className={styles.ciInfo}>
                      <div className={styles.ciNick}>
                        {it.name}
                        <span className={styles.rarTag} style={{ background: rar.ring }}>{rar.label}</span>
                      </div>
                      {/** 
                      <div className={styles.ciAcc}>{it.equippedAccessory.equippedHead?.name ?? 'Sin accesorio'}</div>
                    */}
                      </div>
                    {isActive ? (
                      <span className={`${styles.activar} ${styles.activarActive}`}>
                        <IcCheck /> Activo
                      </span>
                    ) : (
                      <button className={styles.activar} onClick={() => handleActivate(it.id)}
                        disabled={activating === it.id}>
                        {activating === it.id ? '...' : 'Activar'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </BottomSheet>
  )
}
