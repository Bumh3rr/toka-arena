import { createBattleScene, type IBattleScene } from './BattleScene'
  import type { BattleConfig } from './types'

  export class BattleGame {
    private game: any
    private scene: IBattleScene

    constructor(parent: HTMLElement, cfg: BattleConfig) {
      const Phaser = (window as any).Phaser
      const db    = (window as any).dragonBones

      Phaser.Plugins?.PluginCache?.remove?.('DragonBones')
      this.scene = createBattleScene(cfg)

      this.game = new Phaser.Game({
        type: Phaser.AUTO,
        width: cfg.width,
        height: cfg.height,
        transparent: true,
        parent,
        plugins: {
          scene: [{ key: 'DragonBones', plugin: db.phaser.plugin.DragonBonesScenePlugin, mapping: 'dragonbone' }]
        },
        scene: [this.scene]
      })
    }

    // ── Izquierda ─────────────────────────────────────────────────
    setLeftAnimation(name: string, bucle: number)        { this.scene.left.setAnimation(name, bucle) }
    setLeftAccesorioCabeza(index: number) { this.scene.left.setAccesorioCabeza(index) }
    setLeftAccesorioCuerpo(index: number) { this.scene.left.setAccesorioCuerpo(index) }

    // ── Derecha ───────────────────────────────────────────────────
    setRightAnimation(name: string, bucle: number)        { this.scene.right.setAnimation(name, bucle) }
    setRightAccesorioCabeza(index: number) { this.scene.right.setAccesorioCabeza(index) }
    setRightAccesorioCuerpo(index: number) { this.scene.right.setAccesorioCuerpo(index) }

    destroy() {
      this.game?.destroy(true)
      ;(window as any).Phaser?.Plugins?.PluginCache?.remove?.('DragonBones')
    }
  }