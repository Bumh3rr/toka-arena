type ItemType = 'SKIN' | 'EGG' | 'BOOSTER' | 'EVOLUTION_SHIELD'
type EggRarity = 'COMMON' | 'RARE' | 'EPIC'

interface StoreItemDTO {
    id: string;
    itemType: ItemType;
    accessoryType: string | null;
    eggRarity: EggRarity | null;
    displayName: string;
    description: string;
    slot: string | null;
    priceInTokaFeed: number;
    remainingTokaFeed: number;
}