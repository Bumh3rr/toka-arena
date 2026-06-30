import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet'
import { Button, Card, Label, Toast } from '@/shared/ui/Kit'
import { getAccessoryImageSrc } from '@/shared/game/assets'
import { getApiErrorMessage } from '@/shared/api/client'
import { useToast } from '@/shared/hooks/useToast'
import type { AccessorySlot } from '@/shared/domain/accessory'
import { useAccEquip } from './useAccEquip'
import styles from './AccEquipSheet.module.css'
import { getSlotLabel } from '@/shared/constants/accessory'
import { groupByType, buildMeta } from '../../lib/accessoryGroups'

// ── Props ─────────────────────────────────────────────────────────────────────

interface AccEquipSheetProps {
  slot:          AccessorySlot
  tokaId:        string
  equippedAccId: string | undefined
  onClose:       () => void
  onEquipChange: () => void
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function AccEquipSheet({
  slot,
  tokaId,
  equippedAccId,
  onClose,
  onEquipChange,
}: AccEquipSheetProps) {
  const { show, toast } = useToast()

  const {
    slotItems,
    loading,
    loadingMore,
    hasNext,
    actionLoading,
    loadMore,
    handleEquip,
    handleUnequip,
  } = useAccEquip(slot)

  const groups = groupByType(slotItems, equippedAccId)
  const isAnyActing = actionLoading !== null

  // ── Acciones con feedback ─────────────────────────────────────────────────

  const doEquip = async (accId: string, displayName: string) => {
    try {
      await handleEquip(tokaId, accId)
      show(`Equipado: ${displayName}`, { variant: 'celebrity' })
      setTimeout(() => { onEquipChange(); onClose() }, 900)
    } catch (err) {
      show(getApiErrorMessage(err, 'No se pudo equipar'), { variant: 'danger' })
    }
  }

  const doUnequip = async (accId: string, displayName: string) => {
    try {
      await handleUnequip(accId)
      show(`Desequipado: ${displayName}`, { variant: 'info' })
      setTimeout(() => { onEquipChange(); onClose() }, 900)
    } catch (err) {
      show(getApiErrorMessage(err, 'No se pudo desequipar'), { variant: 'danger' })
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const showEmpty   = !loading && groups.length === 0 && !hasNext
  const showHasMore = !loading && groups.length === 0 && hasNext

  return (
    <BottomSheet title={`Accesorios · ${getSlotLabel(slot)}`} onClose={onClose}>
      {loading && <p className={styles.empty}>Cargando...</p>}

      {showEmpty    && <p className={styles.empty}>No tienes accesorios para este slot</p>}
      {showHasMore  && <p className={styles.emptyHint}>Carga más para ver accesorios de este slot</p>}

      {groups.length > 0 && (
        <div className={styles.list}>
          {groups.map(g => {
            const isEquippedHere = g.equippedHere !== null
            const hasAvailable   = g.available.length > 0
            const onlyElsewhere  = !isEquippedHere && !hasAvailable
            const total          = (isEquippedHere ? 1 : 0) + g.available.length + g.elsewhereCount
            const imgSrc         = getAccessoryImageSrc(g.type)

            const actingId = isEquippedHere
              ? g.equippedHere!.id
              : g.available[0]?.id ?? null
            const isThisActing = actingId !== null && actionLoading === actingId

            return (
              <Card
                key={g.type}
                variant={isEquippedHere ? 'gold' : 'cream'}
                padding="sm"
                shadow="md"
                className={onlyElsewhere ? styles.cardDimmed : ''}
              >
                {/* Fila imagen + info */}
                <div className={styles.row}>
                  <div className={styles.thumb}>
                    {imgSrc ? (
                      <img src={imgSrc} alt="" aria-hidden="true" className={styles.thumbImg} />
                    ) : (
                      <span className={styles.thumbFallback} aria-hidden="true">
                        {g.type[0]}
                      </span>
                    )}
                  </div>

                  <div className={styles.info}>
                    <div className={styles.nameRow}>
                      <span className={styles.name}>{g.displayName}</span>
                      {total > 1 && (
                        <Label size="xs" variant="cream" look="soft">×{total}</Label>
                      )}
                      {isEquippedHere && (
                        <Label size="xs" variant="gold">Activo</Label>
                      )}
                    </div>
                    <span className={styles.meta}>{buildMeta(g)}</span>
                  </div>
                </div>

                {/* Separador visual */}
                <div className={styles.divider} aria-hidden="true" />

                {/* CTA */}
                {isEquippedHere ? (
                  <Button
                    variant="warm"
                    size="sm"
                    fullWidth
                    disabled={isAnyActing}
                    onClick={() => doUnequip(g.equippedHere!.id!, g.displayName)}
                  >
                    {isThisActing ? '...' : 'Desequipar'}
                  </Button>
                ) : hasAvailable ? (
                  <Button
                    variant="green"
                    size="sm"
                    fullWidth
                    disabled={isAnyActing}
                    onClick={() => doEquip(g.available[0].id!, g.displayName)}
                  >
                    {isThisActing ? '...' : 'Equipar'}
                  </Button>
                ) : (
                  <Label
                    look="ghost"
                    variant="cream"
                    size="sm"
                    style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '2px 0' }}
                  >
                    En otros Tokas
                  </Label>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {hasNext && !loading && (
        <button
          className={styles.loadMore}
          onClick={loadMore}
          disabled={loadingMore || isAnyActing}
        >
          {loadingMore ? 'Cargando...' : 'Cargar más'}
        </button>
      )}

      {toast && <Toast {...toast} />}
    </BottomSheet>
  )
}
