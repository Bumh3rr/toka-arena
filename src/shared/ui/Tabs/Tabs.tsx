import type { ReactNode } from 'react'
import styles from './Tabs.module.css'

export interface TabsItem<T extends string> {
  value: T
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  muted?: boolean
}

export interface TabsProps<T extends string> {
  value: T
  onChange: (value: T) => void
  items: TabsItem<T>[]
  ariaLabel?: string
  className?: string
}

export default function Tabs<T extends string>({
  value,
  onChange,
  items,
  ariaLabel = 'Tabs',
  className = '',
}: TabsProps<T>) {
  return (
    <div className={`${styles.tabs} ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.value === value
        const classNames = [
          styles.tab,
          active ? styles.active : '',
          item.muted ? styles.muted : '',
          item.disabled ? styles.disabled : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-disabled={item.disabled}
            disabled={item.disabled}
            className={classNames}
            onClick={() => {
              if (!item.disabled) {
                onChange(item.value)
              }
            }}
          >
            {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}