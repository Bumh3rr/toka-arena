import { useMemo, useState } from 'react'
import BottomSheet from '@/shared/ui/Sheet/BottomSheet/BottomSheet'
import TokaAvatar from '@/shared/ui/Tokagotchi/TokaAvatar/TokaAvatar'
import Loading from '@/shared/ui/Loading/Loading'
import { IcCheck, IcChevronDown } from '@/shared/ui/Icons/Icons'
import { RARITY_META } from '@/shared/constants/rarity'
import type { Rarity, Tokagotchi } from '@/shared/domain/tokagotchi'
import { useCollectionModal } from '@/shared/player/hooks/useCollectionModal'
import styles from './CollectionModal.module.css'

interface CollectionModalProps {
  onClose: () => void
}

type SortKey = 'especie' | 'rareza' | 'favoritos'

interface DeckGroup {
  key: string
  nombre: string
  especie: string
  items: Tokagotchi[]
}

const RARITY_ORDER: Record<Rarity, number> = {
  LEGENDARY: 0,
  EPIC: 1,
  RARE: 2,
  COMMON: 3,
}

const SPECIES_LABEL: Record<Tokagotchi['species'], string> = {
  TOFU: 'Tofu',
  MOCHI: 'Mochi',
  HANA: 'Hana',
}

function buildGroups(roster: Tokagotchi[], sort: SortKey): DeckGroup[] {
  if (sort === 'rareza') {
    const map = new Map<Rarity, Tokagotchi[]>()
    for (const toka of roster) {
      const current = map.get(toka.rarity) ?? []
      current.push(toka)
      map.set(toka.rarity, current)
    }

    return [...map.entries()]
      .sort(([a], [b]) => RARITY_ORDER[a] - RARITY_ORDER[b])
      .map(([rarity, items]) => ({
        key: rarity,
        nombre: RARITY_META[rarity].label,
        especie: `${items.length} tokagotchis`,
        items,
      }))
  }

  if (sort === 'favoritos') {
    const favs = roster.filter((t) => Boolean(t.fav))
    const others = roster.filter((t) => !t.fav)
    const groups: DeckGroup[] = []

    if (favs.length > 0) {
      groups.push({
        key: 'favs',
        nombre: 'Favoritos',
        especie: 'Marcados como favoritos',
        items: favs,
      })
    }

    if (others.length > 0) {
      groups.push({
        key: 'otros',
        nombre: 'Otros',
        especie: 'Sin marcar',
        items: others,
      })
    }

    return groups
  }

  const bySpecies = new Map<Tokagotchi['species'], Tokagotchi[]>()
  for (const toka of roster) {
    const current = bySpecies.get(toka.species) ?? []
    current.push(toka)
    bySpecies.set(toka.species, current)
  }

  return [...bySpecies.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([species, items]) => ({
      key: species,
      nombre: SPECIES_LABEL[species],
      especie: `${items.length} tokagotchis`,
      items,
    }))
}

export default function CollectionModal({ onClose }: CollectionModalProps) {
  const [sort, setSort] = useState<SortKey>('especie')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [activating, setActivating] = useState<string | null>(null)
  const { state, activate, nextPage, prevPage, isRefreshing, reload } = useCollectionModal()
  const roster = state.status === 'ready' ? state.data.roster : []
  const activeId = state.status === 'ready' ? state.data.activeId : null
  const pagination = state.status === 'ready'
    ? state.data.pagination
    : {
      page: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    }

  const quick = useMemo(
    () => [...roster]
      .sort((a, b) => {
        if (a.id === activeId) return -1
        if (b.id === activeId) return 1
        return b.cp - a.cp
      })
      .slice(0, 8),
    [roster, activeId],
  )

  const list = useMemo(() => buildGroups(roster, sort), [roster, sort])

  const handleActivate = async (id: string) => {
    if (id === activeId) return
    setActivating(id)
    try {
      await activate(id)
    } finally {
      setActivating(null)
    }
  }

  if (state.status === 'loading') {
    return (
      <BottomSheet title='Cambiar Tokagotchi' onClose={onClose}>
        <Loading text='Cargando colección...' compact />
      </BottomSheet>
    )
  }

  if (state.status === 'error') {
    return (
      <BottomSheet title='Cambiar Tokagotchi' onClose={onClose}>
        <p className={styles.error}>{state.error}</p>
        <button className={styles.retry} onClick={reload}>
          Reintentar
        </button>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet title='Cambiar Tokagotchi' onClose={onClose}>
      <div className={styles.sub}>Acceso rápido</div>
      <div className={styles.quickStrip}>
        {quick.map((t) => {
          const rar = RARITY_META[t.rarity]
          const isActive = t.id === activeId
          return (
            <button
              key={t.id}
              className={`${styles.qChip} ${isActive ? styles.qActive : ''}`}
              onClick={() => handleActivate(t.id)}
              disabled={activating === t.id}
            >
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

      <div className={styles.paginationRow}>
        <button className={styles.pageBtn} onClick={prevPage} disabled={!pagination.hasPrevious || isRefreshing}>
          Anterior
        </button>
        <span className={styles.pageInfo}>Página {pagination.page + 1} de {Math.max(1, pagination.totalPages)}</span>
        <button className={styles.pageBtn} onClick={nextPage} disabled={!pagination.hasNext || isRefreshing}>
          Siguiente
        </button>
      </div>

      <div className={styles.filters}>
        {(['especie', 'rareza', 'favoritos'] as const).map((k) => (
          <button
            key={k}
            className={`${styles.filter} ${sort === k ? styles.filterOn : ''}`}
            onClick={() => setSort(k)}
          >
            {k === 'especie' ? 'Especie' : k === 'rareza' ? 'Rareza' : 'Favoritos'}
          </button>
        ))}
      </div>

      {list.map((g) => {
        const isOpen = open[g.key] ?? true
        return (
          <div key={g.key} className={`${styles.deck} ${isOpen ? styles.deckOpen : ''}`}>
            <div className={styles.deckHead} onClick={() => setOpen((o) => ({ ...o, [g.key]: !isOpen }))}>
              <div className={styles.deckStack}>
                {g.items.slice(0, 3).map((it, i) => (
                  <div key={it.id} style={{ position: 'absolute', top: 0, left: i * 10, zIndex: 3 - i }}>
                    <TokaAvatar tokagotchi={it} size={46} />
                  </div>
                ))}
              </div>
              <div className={styles.deckInfo}>
                <div className={styles.deckName}>{g.nombre} <span className={styles.deckCount}>x{g.items.length}</span></div>
                <div className={styles.deckSub}>{g.especie}</div>
              </div>
              <div className={styles.deckChev}><IcChevronDown /></div>
            </div>

            <div className={styles.deckItems}>
              {g.items.map((it) => {
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
                    </div>
                    {isActive ? (
                      <span className={`${styles.activar} ${styles.activarActive}`}>
                        <IcCheck /> Activo
                      </span>
                    ) : (
                      <button
                        className={styles.activar}
                        onClick={() => handleActivate(it.id)}
                        disabled={activating === it.id}
                      >
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
