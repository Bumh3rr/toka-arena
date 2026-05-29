import { createTokagotchiScene, type ITokagotchiScene } from './TokagotchiScene'
  import type { TokagotchiConfig } from './types'

  export class TokagotchiGame {
    private game: any
    private scene: ITokagotchiScene

    constructor(parent: HTMLElement, cfg: TokagotchiConfig) {
      const Phaser = (window as any).Phaser
      const db = (window as any).dragonBones

      Phaser.Plugins?.PluginCache?.remove?.('DragonBones')

      this.scene = createTokagotchiScene(cfg)

      this.game = new Phaser.Game({
        type: Phaser.AUTO,
        width: cfg.width,
        height: cfg.height,
        transparent: true,
        parent,
        plugins: {
          scene: [{
            key: 'DragonBones',
            plugin: db.phaser.plugin.DragonBonesScenePlugin,
            mapping: 'dragonbone'
          }]
        },
        scene: [this.scene]
      })
    }

    setAnimation(name: string)         { this.scene.setAnimation(name) }
    setAccesorioCabeza(index: number)  { this.scene.setAccesorioCabeza(index) }
    setAccesorioCuerpo(index: number)  { this.scene.setAccesorioCuerpo(index) }

    resize(width: number, height: number, reverse: boolean) {
      this.game.scale?.resize?.(width, height)
      this.scene.updateLayout(width, height, reverse)
    }

    destroy() {
      this.game?.destroy(true)
      ;(window as any).Phaser?.Plugins?.PluginCache?.remove?.('DragonBones')
    }
  }