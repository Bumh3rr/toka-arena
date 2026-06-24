import type { ColFilter } from '../types/collection.types'
import { RARITY_META } from '@/shared/constants/rarity'
import type { Rarity } from '@/shared/domain/tokagotchi'
import styles from './FilterChips.module.css'

interface FilterChipsProps {
  filter: ColFilter
  group: boolean
  onFilter: (f: ColFilter) => void
  onToggleGroup: () => void
}

const RARITY_FILTERS: { key: Rarity; label: string }[] = [
  { key: 'COMMON',    label: RARITY_META.COMMON.label    },
  { key: 'RARE',      label: RARITY_META.RARE.label      },
  { key: 'EPIC',      label: RARITY_META.EPIC.label      },
  { key: 'LEGENDARY', label: RARITY_META.LEGENDARY.label },
]

export default function FilterChips({ filter, group, onFilter, onToggleGroup }: FilterChipsProps) {
  return (
    <div className={styles.chips} role="group" aria-label="Filtros">
      <button
        className={`${styles.chip} ${filter === 'all' ? styles.on : ''}`}
        onClick={() => onFilter('all')}
      >
        Todos
      </button>
      {RARITY_FILTERS.map(r => (
        <button
          key={r.key}
          className={`${styles.chip} ${filter === r.key ? styles.on : ''}`}
          onClick={() => onFilter(r.key)}
        >
          {r.label}
        </button>
      ))}
      <button
        className={`${styles.chip} ${filter === 'fav' ? styles.on : ''}`}
        onClick={() => onFilter('fav')}
      >
        ★ Favoritos
      </button>
      <button
        className={`${styles.chip} ${group ? styles.on : ''}`}
        onClick={onToggleGroup}
      >
        ⊞ Agrupar
      </button>
    </div>
  )
}
