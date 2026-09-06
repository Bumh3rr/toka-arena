import { Card, IconButton, Label } from '@/shared/ui/Kit'
import Loading from '@/shared/ui/Loading/Loading'
import PageError from '@/shared/ui/Error/Error'
import { usePotionLoadout } from '../../../hooks/usePotionLoadout'
import { POTION_SLOT_COUNT } from '../../../constants/potions'
import styles from './PotionPanel.module.css'

/**
 * Equipamiento de pociones para el próximo combate.
 *
 * El servidor **vacía el loadout al terminar cada pelea**, así que esta
 * pantalla se visita antes de cada combate y guarda al instante: pedir un
 * botón de confirmar añadiría un paso a algo que se repite constantemente.
 *
 * Lo que no se puede hacer se apaga en vez de dejar pulsar y fallar: sin
 * unidades, con el tope de la poción alcanzado, o con las tres plazas llenas.
 */
export default function PotionPanel() {
  const { state, saving, adjust, reload } = usePotionLoadout()

  if (state.status === 'loading') return <Loading text="Abriendo la alacena..." />
  if (state.status === 'error') return <PageError message={state.error} onRetry={reload} />

  const { stock, equippedTotal } = state
  const full = equippedTotal >= POTION_SLOT_COUNT

  return (
    <div className={styles.panel}>
      <header className={styles.head}>
        <h2 className={styles.title}>Pociones</h2>
        <Label variant={full ? 'legend' : 'cream'} look="soft" size="xs" uppercase>
          {equippedTotal} de {POTION_SLOT_COUNT}
        </Label>
      </header>

      <p className={styles.lead}>
        Las que lleves al ruedo. Se gastan en el combate y hay que volver a
        equiparlas para el siguiente.
      </p>

      {stock.length === 0 && (
        <Card padding="md" radius="lg" className={styles.empty}>
          No tienes pociones. Se compran en la Tienda.
        </Card>
      )}

      <div className={styles.list}>
        {stock.map((item) => {
          const canAdd = !saving && !full && item.equipped < item.limitPerBattle && item.equipped < item.owned
          const canRemove = !saving && item.equipped > 0

          return (
            <Card key={item.potion.id} padding="sm" radius="lg" className={styles.row}>
              <img className={styles.flask} src={item.potion.image} alt="" />

              <div className={styles.info}>
                <span className={styles.name}>{item.potion.name}</span>
                <span className={styles.effect}>{item.potion.description}</span>
                <span className={styles.owned}>
                  Tienes {item.owned} · máximo {item.limitPerBattle} por combate
                </span>
              </div>

              <div className={styles.stepper}>
                <IconButton
                  variant="cream"
                  size={30}
                  shape="round"
                  disabled={!canRemove}
                  onClick={() => void adjust(item.potion.id, -1)}
                  ariaLabel={`Quitar ${item.potion.name}`}
                >
                  <span className={styles.sign}>−</span>
                </IconButton>

                <span className={styles.count}>{item.equipped}</span>

                <IconButton
                  variant="legend"
                  size={30}
                  shape="round"
                  disabled={!canAdd}
                  onClick={() => void adjust(item.potion.id, 1)}
                  ariaLabel={`Llevar ${item.potion.name}`}
                >
                  <span className={styles.sign}>+</span>
                </IconButton>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
