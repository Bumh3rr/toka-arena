import { useState } from 'react'
import useSWR from 'swr'
import { Button, Toast } from '@/shared/ui/Kit'
import { useToast } from '@/shared/hooks/useToast'
import { getApiErrorMessage } from '@/shared/api/client'
import { accessoryApi } from '../api/accessory.api'
import type { AccessoryDTO } from '@/shared/api/dto/accessory.dto'

const SLOT_LABEL: Record<string, string> = {
  HEAD: 'Cabeza',
  BACK: 'Espalda',
  FACE: 'Cara',
  NECK: 'Cuello',
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

// ── Página principal ─────────────────────────────────────────────────────────
export default function AccessoryTestPage() {
  const { toast, show } = useToast()
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const { data: shop, isLoading: shopLoading } = useSWR('acc-shop', accessoryApi.getShop, { revalidateOnFocus: false })

  const setL = (key: string, val: boolean) => setLoading((prev) => ({ ...prev, [key]: val }))

  const handleBuy = async (acc: AccessoryDTO) => {
    const key = `buy-${acc.type}`
    setL(key, true)
    try {
      await accessoryApi.buy(acc.type)
      show(`Compraste: ${acc.displayName}`, { variant: 'celebrity' })
    } catch (err) {
      show(getApiErrorMessage(err, 'No se pudo comprar'), { variant: 'danger' })
    } finally {
      setL(key, false)
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.page}>
        <div style={s.h1}>accesorios</div>
        <div style={s.sub}>pruebas</div>

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
        {toast && <Toast {...toast} />}
      </div>
    </div>
  )
}
