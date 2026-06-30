import { useMemo } from 'react'
import type { ColFilter } from '../types/collection.types'
import { RARITY_META } from '@/shared/constants/rarity'
import TokaCard from './TokaCard'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'

interface TokaGridProps {
  data: Tokagotchi[]
  filter: ColFilter
  group: boolean
  tokagotchiIdActive?: string | null
  onSelect: (ids: string[]) => void
}

export default function TokaGrid({ data, filter, group, tokagotchiIdActive, onSelect }: TokaGridProps) {
  const filtered = useMemo(() => {
    let list = [...data]
    // Rarity filter is handled server-side; only apply fav client-side
    if (filter === 'fav') list = list.filter(t => t.fav)
    list.sort((a, b) =>
      RARITY_META[b.rarity].order - RARITY_META[a.rarity].order ||
      a.name.localeCompare(b.name)
    )
    return list
  }, [data, filter])

  const cards = useMemo(() => {
    if (!group) {
      return filtered.map(t => ({ toka: t, ids: [t.id], count: 1, stacked: false }))
    }
    const groups: Record<string, Tokagotchi[]> = {}
    filtered.forEach(t => {
      const k = `${t.name}-${t.species}`
      ;(groups[k] = groups[k] ?? []).push(t)
    })
    return Object.values(groups).map(g => {
      const sorted = [...g].sort((a, b) => RARITY_META[b.rarity].order - RARITY_META[a.rarity].order)
      return { toka: sorted[0], ids: sorted.map(t => t.id), count: sorted.length, stacked: sorted.length > 1 }
    })
  }, [filtered, group])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }} role="list">
      {cards.map(c => (
        <TokaCard
          key={c.toka.id}
          toka={c.toka}
          isActive={c.toka.id === tokagotchiIdActive}
          count={c.count}
          stacked={c.stacked}
          onClick={() => onSelect(c.ids)}
        />
      ))}
    </div>
  )
}
