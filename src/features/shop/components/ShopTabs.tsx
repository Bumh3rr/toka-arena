import Tabs from "@/shared/ui/Tabs"
import type { ShopTab } from "../types/shop.types"

interface ShopTabsProps {
    tab: ShopTab
    onSetTab: (t: ShopTab) => void
}

export default function ShopTabs({ tab, onSetTab }: ShopTabsProps) {
    return (
        <Tabs
            ariaLabel="Pestañas de la tienda"
            value={tab}
            onChange={onSetTab}
            items={[
                { value: 'store', label: 'Tienda' },
                { value: 'wallet', label: 'Billetera' },
            ]}
        />
    )
}
