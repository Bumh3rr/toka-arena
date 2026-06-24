import type { ColTab } from '../types/collection.types'
import styles from './ColTabs.module.css'

interface ColTabsProps {
  tab: ColTab
  onSetTab: (t: ColTab) => void
}

export default function ColTabs({ tab, onSetTab }: ColTabsProps) {
  return (
    <div className={styles.tabs} role="tablist">
      <button
        role="tab"
        aria-selected={tab === 'toka'}
        className={`${styles.btn} ${tab === 'toka' ? styles.on : ''}`}
        onClick={() => onSetTab('toka')}
      >
        Tokagotchis
      </button>
      <button
        role="tab"
        aria-selected={tab === 'acc'}
        className={`${styles.btn} ${tab === 'acc' ? styles.on : ''}`}
        onClick={() => onSetTab('acc')}
      >
        Accesorios
      </button>
      <button className={`${styles.btn} ${styles.future}`} disabled aria-disabled="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
        </svg>
        Reacciones
      </button>
    </div>
  )
}
