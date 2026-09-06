import type { CSSProperties } from 'react'
import { COIN_FLIGHT_MS, COIN_SPINS } from '../../constants/matchmaking'
import styles from './InitiativeCoin.module.css'

/**
 * Cara del jugador.
 *
 * `snapshot` es la captura del canvas: trae el Tokagotchi con sus accesorios,
 * pero centrado en un lienzo con márgenes, así que ocupa la cara completa.
 * `species` es el retrato plano, que viene recortado al personaje y necesita
 * su propio margen. La diferencia importa: con un solo tamaño, una de las dos
 * sale diminuta.
 */
export interface CoinFaceArt {
  kind: 'snapshot' | 'species'
  src: string
}

interface InitiativeCoinProps {
  /** Anverso: el Tokagotchi del jugador. */
  player: CoinFaceArt
  /** Reverso: la copa del modo — el lado del rival. */
  cupSrc: string
  /** true ⇒ la moneda cae del lado del jugador, con su Tokagotchi arriba. */
  meFirst: boolean
}

/**
 * Tajadas que forman el canto.
 *
 * A 20 se veía el polígono cuando la moneda pasa de perfil; a 32 el arco de
 * cada tajada baja a ~16px y la silueta se lee redonda. Son 32 `<span>` sin
 * pintura propia, así que el coste es despreciable.
 */
const RIM_SLICES = 32

/**
 * Diámetro y grosor de la moneda, en px.
 *
 * El grosor es generoso a propósito: el canto es lo único que se ve cuando la
 * moneda pasa de perfil, y con 15px quedaba en un hilo.
 */
const COIN_SIZE = 168
const COIN_THICKNESS = 18

/**
 * Moneda de iniciativa.
 *
 * Es una moneda de verdad, no un disco que gira: dos caras opuestas separadas
 * por un canto cilíndrico hecho de {@link RIM_SLICES} tajadas tangenciales, de
 * modo que al tumbar se ve el grosor.
 *
 * **Solo el jugador tiene cara**; enfrente va la copa del modo. Con tres
 * especies, un tercio de los combates son contra la misma, y con un Tokagotchi
 * en cada lado el volado no distinguía nada. Un anverso y un reverso distintos
 * —como en una moneda real— lo resuelven de raíz: cae tu Tokagotchi, abres tú;
 * cae la copa, abre el rival.
 *
 * El vuelo es una sola línea de tiempo (impulso, ápice, caída, dos rebotes y
 * asentado) en lugar de animaciones encadenadas por estado: así no hay ni un
 * fotograma de salto entre fases, y el ángulo final —`COIN_SPINS` vueltas más
 * media si gana el rival— hace imposible que quede a medio camino o en la cara
 * equivocada.
 *
 * Se lanza en cuanto se monta, que es justo cuando hay emparejamiento: antes
 * del match el ruedo lo ocupa el Tokagotchi del jugador, no la moneda.
 */
export default function InitiativeCoin({ player, cupSrc, meFirst }: InitiativeCoinProps) {
  const radius = COIN_SIZE / 2
  // Longitud de arco de cada tajada, con 1px de solape para que no se vea la unión
  const sliceWidth = (Math.PI * COIN_SIZE) / RIM_SLICES + 1

  const vars = {
    '--coin-size': `${COIN_SIZE}px`,
    '--coin-thickness': `${COIN_THICKNESS}px`,
    '--coin-flight': `${COIN_FLIGHT_MS}ms`,
    // Media vuelta extra deja arriba la copa, o sea el lado del rival
    '--coin-final': `${COIN_SPINS * 360 + (meFirst ? 0 : 180)}deg`,
  } as CSSProperties

  return (
    <div className={styles.stage} style={vars}>
      {/* Sombra en la arena: se abre y se aclara cuando la moneda sube */}
      <div className={styles.shadow} aria-hidden="true" />

      {/* Polvareda del primer impacto */}
      <div className={styles.dust} aria-hidden="true" />

      <div className={styles.arc}>
        <div className={styles.squash}>
          <div className={styles.spin}>
            <div className={styles.coin}>
              {/* Anverso — el Tokagotchi del jugador */}
              <div className={`${styles.face} ${styles.faceFront}`}>
                <span className={styles.engrave} aria-hidden="true" />
                <img
                  className={`${styles.art} ${player.kind === 'snapshot' ? styles.artCanvas : styles.artTight}`}
                  src={player.src}
                  alt=""
                />
                <span className={styles.gloss} aria-hidden="true" />
              </div>

              {/* Reverso — la copa del modo, en oro más profundo para que resalte */}
              <div className={`${styles.face} ${styles.faceBack}`}>
                <span className={styles.engrave} aria-hidden="true" />
                <img className={`${styles.art} ${styles.artCup}`} src={cupSrc} alt="" />
                <span className={styles.gloss} aria-hidden="true" />
              </div>

              {/* Canto: cilindro de tajadas tangenciales alrededor del eje Z */}
              <div className={styles.rim} aria-hidden="true">
                {Array.from({ length: RIM_SLICES }, (_, i) => {
                  const angle = (i * 360) / RIM_SLICES
                  return (
                    <span
                      key={angle}
                      className={styles.rimSlice}
                      style={{
                        width: `${sliceWidth}px`,
                        transform: `translate(-50%, -50%) rotateZ(${angle}deg) translateY(${radius}px) rotateX(90deg)`,
                        background: rimShading(angle),
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Color de una tajada del canto según su posición en la circunferencia.
 *
 * El degradado corre a lo largo de la tajada, que tras el `rotateX(90deg)`
 * apunta en profundidad: va del labio delantero al trasero, que es como se
 * ilumina el canto de una moneda de verdad. Los dos extremos oscuros le hacen
 * de contorno, para que la banda no flote sin borde sobre el cielo.
 *
 * Encima se aplica una variación suave por ángulo: con `rotateZ(180deg)
 * translateY(r)` la tajada acaba arriba, así que la luz cenital corresponde a
 * `-cos(angle)`. Va discreta a propósito — con más contraste el canto se veía
 * a parches en los ángulos intermedios.
 *
 * Se resuelve con color y no con `filter: brightness()` porque un filtro
 * obliga al navegador a aplanar el elemento en su propio plano de composición,
 * justo lo que no queremos dentro de un contexto 3D.
 */
function rimShading(angle: number): string {
  const light = 0.84 - 0.2 * Math.cos((angle * Math.PI) / 180)
  const l = (base: number) => `${Math.min(96, base * light).toFixed(1)}%`

  return `linear-gradient(180deg,
    hsl(30 52% 29%) 0%,
    hsl(43 88% ${l(86)}) 14%,
    hsl(38 80% ${l(62)}) 54%,
    hsl(33 68% ${l(42)}) 86%,
    hsl(28 48% 25%) 100%)`
}
