/**
 * @file BackgroundGame.ts
 *
 * Wrapper de `Phaser.Game` para el fondo animado del Home.
 * Ocupa el mismo rol que `TokagotchiGame` para el personaje: instancia Phaser,
 * le pasa la escena creada por la factory y expone una API acotada al componente React.
 *
 * Diferencias respecto a TokagotchiGame:
 *   - No carga el plugin DragonBones (el fondo solo usa primitivos de Phaser).
 *   - Usa `Scale.RESIZE` para llenar dinámicamente el contenedor `.bg`.
 *   - Limita el framerate a 30 fps: es un fondo ambiental, no necesita 60.
 *   - `transparent: true` permite ver el gradiente CSS de `.bg` mientras Phaser bootea
 *     o si el renderizador tarda en pintar el primer frame.
 */
import { createBackgroundScene, type IBackgroundScene, type BackgroundConfig } from './BackgroundScene'

/**
 * Instancia y gestiona el `Phaser.Game` del fondo animado.
 *
 * Uso:
 * ```ts
 * const game = new BackgroundGame(containerElement, { hourOverride: 21 })
 * game.setPaused(true)   // pausa cuando el fondo queda tapado
 * game.destroy()         // al desmontar el componente React
 * ```
 */
export class BackgroundGame {
  private game: any
  private scene: IBackgroundScene

  /**
   * @param parent - Elemento DOM donde Phaser inyectará el `<canvas>`.
   *                 Debe tener dimensiones CSS definidas antes de llamar al constructor.
   * @param cfg    - Configuración opcional de la escena (ver `BackgroundConfig`).
   */
  constructor(parent: HTMLElement, cfg: BackgroundConfig = {}) {
    const Phaser = (window as any).Phaser

    this.scene = createBackgroundScene(cfg)

    this.game = new Phaser.Game({
      type: Phaser.AUTO,             // WebGL si disponible, Canvas en su defecto
      parent,
      transparent: true,             // el canvas no tapa el gradiente CSS de .bg durante el boot
      fps: { target: 30, min: 20 }, // KNOB: 30 fps es suficiente para movimiento ambiental lento
      scale: {
        mode: Phaser.Scale.RESIZE,   // el canvas se redimensiona con el contenedor automáticamente
        parent,
        width: '100%',
        height: '60%',
      },
      scene: [this.scene],
    })
  }

  /**
   * Pausa o reanuda el loop de la escena.
   * Se llama desde `BackgroundCanvas` cuando la sheet tapa el fondo o la pestaña queda oculta.
   */
  setPaused(paused: boolean) { this.scene.setPaused(paused) }

  /**
   * Propaga un cambio de tamaño explícito a la escena.
   * Normalmente no es necesario (Scale.RESIZE lo gestiona), pero útil si el
   * resize viene de un mecanismo fuera del loop de Phaser.
   */
  resize(width: number, height: number) { this.scene.updateLayout(width, height) }

  /**
   * Destruye la instancia de Phaser y libera la memoria del canvas.
   * Debe llamarse en el cleanup del `useEffect` de `BackgroundCanvas`.
   */
  destroy() { this.game?.destroy(true) }
}
