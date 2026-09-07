import { useEffect, useRef, useState } from 'react'
import {
  Alignment,
  Fit,
  Layout,
  RuntimeLoader,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceEnum,
  useViewModelInstanceTrigger,
} from '@rive-app/react-canvas'
import type { Rarity } from '@/shared/domain/tokagotchi'
import styles from './EggRiveArt.module.css'

/**
 * WASM servido desde el propio proyecto, no desde un CDN.
 *
 * El runtime de Rive lo baja de jsdelivr/unpkg por defecto, y esta app corre en
 * el webview de una mini-app de Alipay, donde una petición externa no es de
 * fiar. Mismo criterio que `phaser.js` y `dragonBones.js`.
 */
RuntimeLoader.setWasmUrl('/libs/rive.wasm')

const SRC = '/assets/animations/egg/egg_animations.riv'
const STATE_MACHINE = 'State Machine 1'

/**
 * Valores del enum `TypeEgg` del archivo de Rive.
 *
 * LEGENDARY no se vende en la tienda; cae en `epic` por defensa, para no dejar
 * el Solo sin capa activa si el backend lo añadiera antes que el arte.
 */
const EGG_VARIANT: Record<Rarity, string> = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'epic',
}

/** Ventana del rebote aleatorio, en ms. */
const BOUNCE_MIN_MS = 2600
const BOUNCE_MAX_MS = 7000

const randomDelay = () =>
  BOUNCE_MIN_MS + Math.random() * (BOUNCE_MAX_MS - BOUNCE_MIN_MS)

interface EggRiveArtProps {
  rarity: Rarity
  /** Imagen fija que se ve mientras carga el WASM, y que se queda si no carga. */
  poster: string
  className?: string
}

/**
 * Huevo animado de la tienda.
 *
 * Un solo `.riv` sirve a las tres tarjetas: la variante visible la elige el
 * enum `enumProperty` por data binding, y el nodo Solo del archivo conmuta la
 * capa (`egg_common` / `egg_rare` / `egg_epic`) sin estados extra en la máquina.
 *
 * El rebote se dispara con `bounceTrigger` a intervalos aleatorios y distintos
 * por tarjeta: si los tres saltaran a la vez se leería como un parpadeo de la
 * pantalla, no como tres huevos vivos. La transición de vuelta a `idle_eggs`
 * tiene Exit Time al 100% en el archivo, así que el salto se completa y vuelve
 * al reposo por su cuenta — aquí no hay que apagar nada.
 */
export default function EggRiveArt({ rarity, poster, className = '' }: EggRiveArtProps) {
  const [ready, setReady] = useState(false)

  const { rive, RiveComponent } = useRive({
    src: SRC,
    stateMachines: STATE_MACHINE,
    autoplay: true,
    // Enlaza la instancia por defecto del ViewModel: sin esto los hooks de
    // data binding no encuentran nada a lo que escribir.
    autoBind: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: () => setReady(true),
  })

  const viewModel = useViewModel(rive, { useDefault: true })
  const instance = useViewModelInstance(viewModel, { useDefault: true, rive })

  const { setValue: setVariant } = useViewModelInstanceEnum('enumProperty', instance)
  const { trigger: bounce } = useViewModelInstanceTrigger('bounceTrigger', instance)

  // La rareza manda sobre la variante visible
  useEffect(() => {
    setVariant(EGG_VARIANT[rarity])
  }, [rarity, setVariant])

  /*
   * El temporizador se reprograma en cada disparo en vez de usar un intervalo
   * fijo: así el ritmo no se repite y las tres tarjetas no se sincronizan.
   */
  const bounceRef = useRef(bounce)

  // En un efecto y no en el render: escribir un ref durante el render no es
  // válido, y el temporizador de abajo no debe reiniciarse cuando `bounce`
  // cambie de identidad.
  useEffect(() => {
    bounceRef.current = bounce
  }, [bounce])

  useEffect(() => {
    if (!ready) return

    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        bounceRef.current()
        schedule()
      }, randomDelay())
    }

    schedule()
    return () => window.clearTimeout(timer)
  }, [ready])

  return (
    <span className={`${styles.stage} ${className}`}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className={`${styles.poster} ${ready ? styles.hidden : ''}`}
      />
      <RiveComponent className={`${styles.canvas} ${ready ? styles.shown : ''}`} />
    </span>
  )
}
