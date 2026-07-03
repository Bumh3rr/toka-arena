import { useState } from 'react'
import Tabs from '@/shared/ui/Tabs'
import type { ShopTab } from '../types/shop.types'
import styles from './ShopPage.module.css'

export default function ShopPage() {
  const [tab, setTab] = useState<ShopTab>('store')

  return (
    <div className={styles.screen}>
      <div className={styles.background} />

      <div className={styles.topbar}>
        <span className={styles.title}>Tienda</span>
      </div>

      <Tabs
        ariaLabel="Pestañas de la tienda"
        value={tab}
        onChange={setTab}
        items={[
          { value: 'store', label: 'Tienda' },
          { value: 'wallet', label: 'Billetera' },
        ]}
      />

      <div className={styles.scroll}>
        {tab === 'store' && <div>Contenido</div>}
        {tab === 'wallet' && <div>Contenido de la billetera</div>}
      </div>
    </div>
  )

}
