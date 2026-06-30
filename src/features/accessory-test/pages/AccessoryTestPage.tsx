import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Button, Toast } from '@/shared/ui/Kit'
import { useToast } from '@/shared/hooks/useToast'
import { getApiErrorMessage } from '@/shared/api/client'
import { accessoryApi } from '../api/accessory.api'
import { usePlayer } from '@/shared/player/hooks/usePlayer'
import { tokagotchiApi } from '@/shared/api/tokagotchi.api'
import type { TokagotchiDTO } from '@/shared/api/dto/tokagotchi.dto'
import type { AccessoryDTO } from '@/shared/api/dto/accessory.dto'

const SLOT_LABEL: Record<string, string> = {
  HEAD: 'Cabeza',
  BACK: 'Espalda',
  FACE: 'Cara',
  NECK: 'Cuello',
}

const RARITY_COLOR: Record<string, string> = {
  COMMON: '#888',
  RARE: '#3b82f6',
  EPIC: '#a855f7',
  LEGENDARY: '#f59e0b',
}

// ── Inline styles (temporal, sin CSS module) ─────────────────────────────────
const s = {
  wrap:        { height: '100%', overflowY: 'auto' as const },
  page:        { padding: '16px', fontFamily: 'system-ui, sans-serif', maxWidth: 480, margin: '0 auto', paddingBottom: 40 } as React.CSSProperties,
  h1:          { fontSize: 18, fontWeight: 700, marginBottom: 4 } as React.CSSProperties,
  sub:         { fontSize: 12, color: '#888', marginBottom: 20 } as React.CSSProperties,
  section:     { marginBottom: 24 } as React.CSSProperties,
  sectionTitle:{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.5px', color: '#555', marginBottom: 10 },
  card:        { border: '1.5px solid #e5e1d8', borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', flexDirection: 'column' as const, gap: 6 },
  cardRow:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } as React.CSSProperties,
  name:        { fontWeight: 700, fontSize: 14 } as React.CSSProperties,
  meta:        { fontSize: 12, color: '#888' } as React.CSSProperties,
  price:       { fontSize: 13, fontWeight: 700, color: '#c17f1a' } as React.CSSProperties,
  badge:       { fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: '#e8f5e9', color: '#2e7d32', flexShrink: 0 } as React.CSSProperties,
  badgeOff:    { background: '#f3f3f3', color: '#999' } as React.CSSProperties,
  input:       { border: '1.5px solid #ccc', borderRadius: 8, padding: '7px 10px', fontSize: 13, width: '100%', boxSizing: 'border-box' as const, marginBottom: 12 },
  label:       { fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4, display: 'block' } as React.CSSProperties,
  btnRow:      { display: 'flex', gap: 6 } as React.CSSProperties,
  empty:       { fontSize: 13, color: '#aaa', textAlign: 'center' as const, padding: '16px 0' },
  tokaInfo:    { background: '#f9f7f4', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 10 } as React.CSSProperties,
  tokaName:    { fontWeight: 700, fontSize: 13 } as React.CSSProperties,
  tokaMeta:    { fontSize: 11, color: '#888' } as React.CSSProperties,
  tokaRarity:  { fontSize: 11, fontWeight: 700 } as React.CSSProperties,
}

// ── Sub-componente: info del toka al que está equipado ───────────────────────
function EquippedTokaInfo({ tokagotchiId }: { tokagotchiId: string }) {
  const { data, isLoading } = useSWR<TokagotchiDTO>(
    `toka-${tokagotchiId}`,
    () => tokagotchiApi.getTokaById(tokagotchiId),
    { revalidateOnFocus: false },
  )

  if (isLoading) return <div style={{ ...s.tokaInfo, color: '#aaa', fontSize: 12 }}>Cargando toka...</div>
  if (!data) return null

  return (
    <div style={s.tokaInfo}>
      <div style={{ flex: 1 }}>
        <div style={s.tokaName}>{data.name}</div>
        <div style={s.tokaMeta}>{data.species} · CP {data.cp}</div>
      </div>
      <span style={{ ...s.tokaRarity, color: RARITY_COLOR[data.rarity] ?? '#888' }}>
        {data.rarity}
      </span>
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function AccessoryTestPage() {
  const { toast, show } = useToast()
  const { state: playerState } = usePlayer()
  const [tokaId, setTokaId] = useState('')
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (playerState.status === 'ready' && playerState.data.mainTokagotchi?.id) {
      setTokaId(playerState.data.mainTokagotchi.id)
    }
  }, [playerState.status])

  const { data: shop, isLoading: shopLoading } = useSWR('acc-shop', accessoryApi.getShop, { revalidateOnFocus: false })
  const { data: inventory, mutate: reloadInventory, isLoading: invLoading } = useSWR(
    'acc-inventory',
    () => accessoryApi.getInventory(),
    { revalidateOnFocus: false },
  )

  const setL = (key: string, val: boolean) => setLoading((prev) => ({ ...prev, [key]: val }))

  const handleBuy = async (acc: AccessoryDTO) => {
    const key = `buy-${acc.type}`
    setL(key, true)
    try {
      await accessoryApi.buy(acc.type)
      show(`Compraste: ${acc.displayName}`, { variant: 'celebrity' })
      reloadInventory()
    } catch (err) {
      show(getApiErrorMessage(err, 'No se pudo comprar'), { variant: 'danger' })
    } finally {
      setL(key, false)
    }
  }

  const handleEquip = async (acc: AccessoryDTO) => {
    if (!tokaId.trim()) { show('Ingresa un Tokagotchi ID', { variant: 'warn' }); return }
    if (!acc.id) return
    const key = `equip-${acc.id}`
    setL(key, true)
    try {
      await accessoryApi.equip(tokaId.trim(), acc.id)
      show(`Equipado: ${acc.displayName}`, { variant: 'celebrity' })
      reloadInventory()
    } catch (err) {
      show(getApiErrorMessage(err, 'No se pudo equipar'), { variant: 'danger' })
    } finally {
      setL(key, false)
    }
  }

  const handleUnequip = async (acc: AccessoryDTO) => {
    if (!acc.id) return
    const key = `unequip-${acc.id}`
    setL(key, true)
    try {
      await accessoryApi.unequip(acc.id)
      show(`Desequipado: ${acc.displayName}`, { variant: 'celebrity' })
      reloadInventory()
    } catch (err) {
      show(getApiErrorMessage(err, 'No se pudo desequipar'), { variant: 'danger' })
    } finally {
      setL(key, false)
    }
  }

  const items = inventory?.content ?? []
  const unequipped = items.filter((a) => !a.equipped)
  const equipped = items.filter((a) => a.equipped)

  return (
    <div style={s.wrap}>
      <div style={s.page}>
        <div style={s.h1}>🧪 Accesorios — Test</div>
        <div style={s.sub}>Temporal · Solo para pruebas de colección</div>

        {/* Tokagotchi ID */}
        <div style={s.section}>
          <label style={s.label}>
            Tokagotchi ID (para equipar)
            {playerState.status === 'ready' && playerState.data.mainTokagotchi && (
              <span style={{ color: '#c17f1a', marginLeft: 6 }}>
                — {playerState.data.mainTokagotchi.name} ({playerState.data.mainTokagotchi.species})
              </span>
            )}
          </label>
          <input
            style={s.input}
            placeholder="01ARZ3ABCDEFGHIJKLMNOPQRST"
            value={tokaId}
            onChange={(e) => setTokaId(e.target.value)}
          />
        </div>

        {/* Tienda */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Tienda</div>
          {shopLoading && <div style={s.empty}>Cargando...</div>}
          {!shopLoading && !shop?.length && <div style={s.empty}>Sin items</div>}
          {shop?.map((acc) => (
            <div key={acc.type} style={s.card}>
              <div style={s.cardRow}>
                <div>
                  <div style={s.name}>{acc.displayName}</div>
                  <div style={s.meta}>{SLOT_LABEL[acc.slot] ?? acc.slot} · {acc.description}</div>
                </div>
                <div style={s.price}>{acc.price} TF</div>
              </div>
              <div style={s.btnRow}>
                <Button
                  variant="warm"
                  size="sm"
                  onClick={() => handleBuy(acc)}
                  disabled={loading[`buy-${acc.type}`]}
                >
                  {loading[`buy-${acc.type}`] ? '...' : 'Comprar'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Inventario sin equipar */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Inventario — sin equipar ({unequipped.length})</div>
          {invLoading && <div style={s.empty}>Cargando...</div>}
          {!invLoading && !unequipped.length && <div style={s.empty}>Vacío</div>}
          {unequipped.map((acc) => (
            <div key={acc.id} style={s.card}>
              <div style={s.cardRow}>
                <div>
                  <div style={s.name}>{acc.displayName}</div>
                  <div style={s.meta}>{SLOT_LABEL[acc.slot] ?? acc.slot}</div>
                </div>
                <span style={{ ...s.badge, ...s.badgeOff }}>Libre</span>
              </div>
              <div style={s.btnRow}>
                <Button
                  variant="green"
                  size="sm"
                  onClick={() => handleEquip(acc)}
                  disabled={loading[`equip-${acc.id}`]}
                >
                  {loading[`equip-${acc.id}`] ? '...' : 'Equipar'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Inventario equipado */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Inventario — equipados ({equipped.length})</div>
          {!invLoading && !equipped.length && <div style={s.empty}>Ninguno equipado</div>}
          {equipped.map((acc) => (
            <div key={acc.id} style={s.card}>
              <div style={s.cardRow}>
                <div>
                  <div style={s.name}>{acc.displayName}</div>
                  <div style={s.meta}>{SLOT_LABEL[acc.slot] ?? acc.slot}</div>
                </div>
                <span style={s.badge}>Equipado</span>
              </div>
              {acc.tokagotchiId && <EquippedTokaInfo tokagotchiId={acc.tokagotchiId} />}
              <div style={s.btnRow}>
                <Button
                  variant="warm"
                  size="sm"
                  onClick={() => handleUnequip(acc)}
                  disabled={loading[`unequip-${acc.id}`]}
                >
                  {loading[`unequip-${acc.id}`] ? '...' : 'Desequipar'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {toast && <Toast {...toast} />}
      </div>
    </div>
  )
}
