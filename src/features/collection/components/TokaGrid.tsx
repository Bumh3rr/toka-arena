// src/features/collection/components/TokaGrid.tsx
import { useMemo } from 'react'
import type { ColFilter } from '../types/collection.types'
import { RARITY_META } from '@/shared/constants/rarity'
import TokaCard from './TokaCard'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'

interface TokaGridProps {
  data: Tokagotchi[]
  filter: ColFilter
  group: boolean
  onSelect: (id: string) => void
}

export default function TokaGrid({ data, filter, group, onSelect }: TokaGridProps) {
  const filtered = useMemo(() => {
    let list = [...data]
    if (filter !== 'all') list = list.filter(t => t.rarity === filter)
    list.sort((a, b) =>
      RARITY_META[b.rarity].order - RARITY_META[a.rarity].order ||
      a.name.localeCompare(b.name)
    )
    return list
  }, [data, filter])

  const cards = useMemo(() => {
    if (!group) return filtered.map(t => ({ toka: t, count: 1, stacked: false }))
    const groups: Record<string, typeof filtered> = {}
    filtered.forEach(t => {
      const k = `${t.name}-${t.species}`
      ;(groups[k] = groups[k] ?? []).push(t)
    })
    return Object.values(groups).map(g => {
      const top = g.sort((a, b) => RARITY_META[b.rarity].order - RARITY_META[a.rarity].order)[0]
      return { toka: top, count: g.length, stacked: g.length > 1 }
    })
  }, [filtered, group])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }} role="list">
      {cards.map(c => (
        <TokaCard
          key={c.toka.id}
          toka={c.toka}
          isActive
          count={c.count}
          stacked={c.stacked}
          onClick={() => onSelect(c.toka.id)}
        />
      ))}
    </div>
  )
}
