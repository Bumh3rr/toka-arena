import { useState } from 'react'
import { Fit, Alignment, Layout, RuntimeLoader, useRive } from '@rive-app/react-canvas'

/**
 * WASM servido desde el propio proyecto, no desde un CDN.
 *
 * El runtime de Rive baja `rive.wasm` de jsdelivr/unpkg por defecto, y esta app
 * corre dentro del webview de una mini-app de Alipay, donde una petición a un
 * dominio externo no es de fiar. Mismo criterio que `phaser.js` y
 * `dragonBones.js`, que ya se sirven desde `/libs/`.
 */
RuntimeLoader.setWasmUrl('/libs/rive.wasm')

interface RiveAnimationProps {
  /** Ruta del `.riv`. */
  src: string
  /**
   * Imagen que se ve mientras el WASM carga — y que se queda si nunca carga.
   *
   * Es la red de seguridad de esta pantalla: si el webview bloquea el WASM, el
   * jugador sigue viendo la ilustración estática en vez de un hueco. Por eso el
   * póster no se desmonta, solo se desvanece.
   */
  poster: string
  className?: string
  /** Nombre de la máquina de estados, si el archivo necesita una concreta. */
  stateMachine?: string
}

/**
 * Animación de Rive con degradación elegante.
 *
 * Se monta en diferido desde quien la usa (`React.lazy`): el runtime más el
 * WASM pesan cerca de 2 MB, así que no deben entrar en el bundle inicial de una
 * mini-app. Solo se pagan cuando el jugador abre la pantalla que los necesita.
 */
export default function RiveAnimation({
  src,
  poster,
  className = '',
  stateMachine,
}: RiveAnimationProps) {
  const [ready, setReady] = useState(false)

  const { RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomCenter }),
    onLoad: () => setReady(true),
  })

  return (
    <div className={className} style={{ position: 'relative' }}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom',
          opacity: ready ? 0 : 1,
          transition: 'opacity .4s ease',
        }}
      />
      <RiveComponent
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          opacity: ready ? 1 : 0,
          transition: 'opacity .4s ease',
        }}
      />
    </div>
  )
}
