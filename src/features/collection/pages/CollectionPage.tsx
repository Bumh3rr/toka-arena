import { useState } from 'react'
import ColTabs from '../components/ColTabs'
import type { ColTab } from '../types/collection.types'
import CollectionTokasSection from '../sections/CollectionTokasSection/CollectionTokasSection'
import CollectionAccessoriesSection from '../sections/CollectionAccessoriesSection/CollectionAccessoriesSection'
import CollectionReactionsSection from '../sections/CollectionReactionsSection/CollectionReactionsSection'
import styles from './CollectionPage.module.css'

export default function CollectionPage() {
  const [tab, setTab] = useState<ColTab>('toka')

  return (
    <div className={styles.screen}>
      <div className={styles.background} />

      <div className={styles.topbar}>
        <span className={styles.title}>Colección</span>
      </div>

      <ColTabs tab={tab} onSetTab={setTab} />

      <div className={styles.scroll}>
        {tab === 'toka' && <CollectionTokasSection />}
        {tab === 'acc' && <CollectionAccessoriesSection />}
        {tab === 'reactions' && <CollectionReactionsSection />}
      </div>
    </div>
  )
}
