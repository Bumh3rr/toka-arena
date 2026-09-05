import { useState } from 'react'
import type { ShopTab } from '../types/shop.types'
import FeatureScreen from '@/shared/ui/Screen/FeatureScreen'
import ShopTabs from '../components/ShopTabs'
import StoreSection from '../sections/StoreSection/StoreSection'
import WalletSection from '../sections/WalletSection/WalletSection'

export default function ShopPage() {
  const [tab, setTab] = useState<ShopTab>('store')

  return (
    <FeatureScreen
      title="Tienda"
      backgroundImage="/assets/backgrounds/bg_shop.png"
      tabs={<ShopTabs tab={tab} onSetTab={setTab} />}
    >
      {tab === 'store' && <StoreSection />}
      {tab === 'wallet' && <WalletSection />}
    </FeatureScreen>
  )
}