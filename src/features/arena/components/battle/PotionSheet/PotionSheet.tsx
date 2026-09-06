import { createPortal } from 'react-dom'
import { Button } from '@/shared/ui/Kit'
import BottomSheet from '@/shared/ui/Sheet/BottomSheet/BottomSheet'
import { POTIONS_META } from '../../../constants/potions'
import type { PotionId } from '../../../types/arena.types'
import styles from './PotionSheet.module.css'

interface PotionSheetProps {
  /** Unidades que quedan por tipo en este combate. */
  potions: Partial<Record<PotionId, number>>
  /** false ⇒ no es tu turno: se puede mirar, no beber. */
  enabled: boolean
  onUse: (potion: PotionId) => void
  onClose: () => void
}

/**
 * Inventario de combate.
 *
 * Solo lista lo que se equipó antes de entrar: en batalla no se puede añadir
 * nada. Una poción agotada se queda en la lista, marcada, para que el jugador
 * recuerde qué trajo y qué ya gastó.
 *
 * Va portalizada a `body` por BUG-4: dentro de un contenedor con scroll o con
 * su propio contexto de apilamiento, un `position: fixed` se ancla al
 * contenido y el sheet acaba por debajo de lo que debería tapar.
 */
export default function PotionSheet({
  potions,
  enabled,
  onUse,
  onClose,
}: PotionSheetProps) {
  const carried = (Object.keys(potions) as PotionId[]).filter(
    (id) => potions[id] !== undefined,
  )

  return createPortal(
    <BottomSheet title="Tus pociones" sub="Usar una gasta tu turno" onClose={onClose}>
      <div className={styles.list}>
        {carried.length === 0 && (
          <p className={styles.empty}>
            No trajiste pociones a este combate. Se equipan desde el lobby.
          </p>
        )}

        {carried.map((id) => {
          const meta = POTIONS_META[id]
          const left = potions[id] ?? 0
          const spent = left === 0

          return (
            <div key={id} className={`${styles.row} ${spent ? styles.rowSpent : ''}`}>
              <img className={styles.flask} src={meta.image} alt="" />

              <div className={styles.info}>
                <span className={styles.name}>{meta.name}</span>
                <span className={styles.effect}>{meta.description}</span>
              </div>

              {spent ? (
                <span className={styles.used}>Usada</span>
              ) : (
                <Button
                  variant="green"
                  size="md"
                  radius="lg"
                  disabled={!enabled}
                  onClick={() => onUse(id)}
                >
                  Usar{left > 1 ? ` (${left})` : ''}
                </Button>
              )}
            </div>
          )
        })}

        <Button variant="cream" size="md" radius="lg" fullWidth onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </BottomSheet>,
    document.body,
  )
}
