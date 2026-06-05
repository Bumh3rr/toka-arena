/* ============================================================
   Toka Arena — Wrapper del juego de fondo
   Análogo a TokagotchiGame, pero sin DragonBones.
   Llena su contenedor (.bg) con Scale.RESIZE y capea a 30fps.
   ============================================================ */
import { createBackgroundScene, type IBackgroundScene, type BackgroundConfig } from './BackgroundScene'

export class BackgroundGame {
  private game: any
  private scene: IBackgroundScene

  constructor(parent: HTMLElement, cfg: BackgroundConfig = {}) {
    const Phaser = (window as any).Phaser

    this.scene = createBackgroundScene(cfg)

    this.game = new Phaser.Game({
      type: Phaser.AUTO,            // WebGL si está disponible, si no Canvas
      parent,
      fps: { target: 30, min: 20 }, // fondo ambiental: 30fps sobra
      scale: {
        mode: Phaser.Scale.RESIZE,  // llena el contenedor y reacciona a cambios de tamaño
        parent,
        width: '100%',
        height: '60%',
      },
      scene: [this.scene],
    })
  }

  setPaused(paused: boolean) { this.scene.setPaused(paused) }

  resize(width: number, height: number) { this.scene.updateLayout(width, height) }

  destroy() { this.game?.destroy(true) }
}
