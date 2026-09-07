import { Button, Card, IconButton, Label } from '@/shared/ui/Kit'
import Loading from '@/shared/ui/Loading/Loading'
import PageError from '@/shared/ui/Error/Error'
import { usePotionLoadout } from '../../../hooks/usePotionLoadout'
import { POTION_SLOT_COUNT } from '../../../constants/potions'
import styles from './PotionPanel.module.css'

/**
 * Alacena de pociones: se compra y se equipa en la misma pantalla.
 *
 * Están juntas porque **la decisión de comprar depende de las reglas de
 * equipar**: el tope de {@link POTION_SLOT_COUNT} unidades y el
 * `limitPerBattle` de cada poción. Separarlas dejaría que el jugador compre
 * diez Vidas Menores para descubrir luego que solo puede llevar dos.
 *
 * El servidor **vacía el loadout al terminar cada pelea**, así que esto se
 * visita antes de cada combate y guarda al instante: un botón de confirmar
 * añadiría un paso a algo que se repite constantemente.
 *
 * Lo que no se puede hacer se apaga en vez de dejar pulsar y fallar: sin
 * unidades, con el tope de la poción alcanzado, con las tres plazas llenas, o
 * sin TF suficiente.
 */
export default function PotionPanel() {
  const { state, saving, adjust, buying, buy, reload } = usePotionLoadout()

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
        Compra las que te falten y elige las que llevas al ruedo. Se gastan en
        el combate y hay que volver a equiparlas para el siguiente.
      </p>

      <div className={styles.list}>
        {stock.map((item) => {
          const { id, name, description, image } = item.potion
          const atLimit = item.equipped >= item.limitPerBattle
          const canAdd = !saving && !full && !atLimit && item.equipped < item.owned
          const canRemove = !saving && item.equipped > 0
          const inFlight = buying === id

          return (
            <Card key={id} padding="sm" radius="lg" className={styles.row}>
              {/* La cantidad que posees va sobre el frasco: es del objeto */}
              <div className={styles.flaskWrap}>
                <img className={styles.flask} src={image} alt="" aria-hidden="true" />
                {item.owned > 0 && <span className={styles.owned}>×{item.owned}</span>}
              </div>

              <div className={styles.body}>
                <span className={styles.name}>{name}</span>
                <span className={styles.effect}>
                  {description} · máx {item.limitPerBattle} por combate
                </span>

                <div className={styles.actions}>
                  {/*
                   * "Llevas" nombra el verbo del contador. Sin la etiqueta, el
                   * signo + se confunde con comprar, que es la otra acción de
                   * la misma fila.
                   */}
                  <span className={styles.carryLabel}>Llevas</span>

                  <div className={styles.stepper}>
                    <IconButton
                      variant="cream"
                      size={28}
                      shape="round"
                      disabled={!canRemove}
                      onClick={() => void adjust(id, -1)}
                      ariaLabel={`Llevar una ${name} menos`}
                    >
                      <span className={styles.sign}>−</span>
                    </IconButton>

                    <span className={styles.count}>{item.equipped}</span>

                    <IconButton
                      variant="legend"
                      size={28}
                      shape="round"
                      disabled={!canAdd}
                      onClick={() => void adjust(id, 1)}
                      ariaLabel={`Llevar una ${name} más`}
                    >
                      <span className={styles.sign}>+</span>
                    </IconButton>
                  </div>

                  <Button
                    variant="gold"
                    size="sm"
                    radius="pill"
                    className={styles.buy}
                    disabled={inFlight || !item.affordable || buying !== null}
                    onClick={() => void buy(id)}
                    icon={
                      <img
                        src="/assets/ui/tf/tf.svg"
                        alt=""
                        aria-hidden="true"
                        className={styles.coin}
                      />
                    }
                  >
                    {inFlight ? '...' : item.price}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
