import Tabs from '@/shared/ui/Tabs'
import type { ColTab } from '../types/collection.types'

const REACTIONS_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)

interface ColTabsProps {
  tab: ColTab
  onSetTab: (t: ColTab) => void
}

export default function ColTabs({ tab, onSetTab }: ColTabsProps) {
  return (
    <Tabs
      ariaLabel="Pestañas de la colección"
      value={tab}
      onChange={onSetTab}
      items={[
        { value: 'toka', label: 'Tokagotchis' },
        { value: 'acc', label: 'Accesorios' },
        { value: 'reactions', label: 'Reacciones', icon: REACTIONS_ICON, muted: true },
      ]}
    />
  )
}
