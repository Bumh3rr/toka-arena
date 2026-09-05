import { useState } from 'react'
import type { ColTab } from '../types/collection.types'
import CollectionTokasSection from '../sections/CollectionTokasSection/CollectionTokasSection'
import CollectionAccessoriesSection from '../sections/CollectionAccessoriesSection/CollectionAccessoriesSection'
import CollectionReactionsSection from '../sections/CollectionReactionsSection/CollectionReactionsSection'
import FeatureScreen from '@/shared/ui/Screen/FeatureScreen'
import ColTabs from '../components/ColTabs'

export default function CollectionPage() {
  const [tab, setTab] = useState<ColTab>('toka')

  return (
    <FeatureScreen
      title="Colección"
      backgroundImage="/assets/backgrounds/bg_coleccion.png"
      tabs={<ColTabs tab={tab} onSetTab={setTab} />}
    >
      {tab === 'toka' && <CollectionTokasSection />}
      {tab === 'acc' && <CollectionAccessoriesSection />}
      {tab === 'reactions' && <CollectionReactionsSection />}
    </FeatureScreen>
  )
}
