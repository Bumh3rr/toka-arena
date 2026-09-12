import type { AccGroup } from '../../lib/accessoryGroups'
import { getAccessoryImagePngSrc } from '@/shared/game/assets'
import { Label } from '@/shared/ui/Kit'
import styles from './SlotInventory.module.css'

interface SlotInventoryProps {
  slotLabel: string
  groups: AccGroup[]
  equippedHereId: string | undefined
  actionLoading: string | null
  loading: boolean
  hasNext: boolean
  error: boolean
  onLoadMore: () => void
  onReload: () => void
  onEquip: (accId: string, displayName: string) => void
  onUnequip: (accId: string, displayName: string) => void
}

export default function SlotInventory({
  slotLabel, groups, equippedHereId, actionLoading,
  loading, hasNext, error, onLoadMore, onReload, onEquip, onUnequip,
}: SlotInventoryProps) {
  const isActing = actionLoading !== null
  const count = groups.reduce(
    (n, g) => n + (g.equippedHere ? 1 : 0) + g.available.length + g.elsewhereCount, 0,
  )

  if (loading) return <p className={styles.hint}>Cargando inventario…</p>
  if (error) {
    return (
      <div className={styles.hint}>
        No se pudo cargar el inventario.{' '}
        <button className={styles.loadMore} onClick={onReload}>Reintentar</button>
      </div>
    )
  }
  if (groups.length === 0 && !hasNext) {
    return <p className={styles.hint}>No tienes accesorios de {slotLabel.toLowerCase()}. ¡Visita la tienda!</p>
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.title}>{slotLabel}</span>
        <span className={styles.count}>{count} en inventario</span>
      </div>

      <div className={styles.row}>
        {/* Quitar */}
        {equippedHereId && (
          <button
            type="button"
            className={`${styles.chip} ${styles.remove}`}
            disabled={isActing}
            aria-label={`Quitar accesorio de ${slotLabel}`}
            onClick={() => onUnequip(equippedHereId, slotLabel)}
          >
            <span className={styles.removeMark} aria-hidden="true">⊘</span>
            <span className={styles.chipName}>Quitar</span>
          </button>
        )}

        {groups.map((g) => {
          const isEquippedHere = g.equippedHere !== null
          const free = g.available[0] ?? null
          const onlyElsewhere = !isEquippedHere && !free
          const total = (isEquippedHere ? 1 : 0) + g.available.length + g.elsewhereCount
          const src = getAccessoryImagePngSrc(g.type)
          const actId = isEquippedHere ? g.equippedHere!.id! : free?.id ?? null
          const isThisActing = actId !== null && actionLoading === actId

          const handle = () => {
            if (isActing || isEquippedHere) return            // equipado: el "Quitar" lo gestiona
            if (free) onEquip(free.id!, g.displayName)         // equipa una instancia libre de este tipo
          }

          return (
            <button
              key={g.type}
              type="button"
              className={`${styles.chip} ${isEquippedHere ? styles.equipped : ''} ${onlyElsewhere ? styles.dimmed : ''}`}
              disabled={isActing || isEquippedHere || onlyElsewhere}
              aria-label={`${g.displayName}${isEquippedHere ? ', equipado' : ''}`}
              onClick={handle}
            >
              <span className={styles.thumb}>
                {src
                  ? <img src={src} alt="" aria-hidden="true" className={styles.thumbImg} />
                  : <span className={styles.thumbFallback} aria-hidden="true">{g.type[0]}</span>}
                {total > 1 && <span className={styles.qty}>×{total}</span>}
              </span>
              <span className={styles.chipName}>{isThisActing ? '…' : g.displayName}</span>
              {isEquippedHere && <Label size="xs" variant="legend">Puesto</Label>}
              {onlyElsewhere && <span className={styles.elsewhere}>En otro Toka</span>}
            </button>
          )
        })}
      </div>

      {hasNext && (
        <button className={styles.loadMore} onClick={onLoadMore} disabled={isActing}>
          Cargar más
        </button>
      )}
    </div>
  )
}
