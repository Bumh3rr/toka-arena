import type { BattleConfig } from './types'
  import { ArmatureController, type IArmatureController } from './ArmatureController'

  export interface IBattleScene {
    left: IArmatureController
    right: IArmatureController
  }

  export function createBattleScene(cfg: BattleConfig): IBattleScene {
    const Phaser = (window as any).Phaser

    const left  = new ArmatureController()
    const right = new ArmatureController()

    class Scene extends Phaser.Scene {
      readonly left  = left
      readonly right = right

      constructor() { super({ key: 'DragonBones' }) }

      preload() {
        const loadToka = (key: string) => {
          ;(this.load as any).dragonbone(
            key,
            `/assets/${key}/${key}_tex.png`,
            `/assets/${key}/${key}_tex.json`,
            `/assets/${key}/${key}_ske.json`
          )
        }
        const { izquierda, derecha } = cfg
        loadToka(izquierda.toka)
        if (derecha.toka !== izquierda.toka) loadToka(derecha.toka)
      }

      create() {
        const SCALE = Math.max(0.2, Math.min(cfg.width, cfg.height) / 5000)
        const { izquierda, derecha } = cfg

        const leftArm = (this as any).add.armature('Armature', izquierda.toka)
        left.mount(leftArm, izquierda.animacion ?? 'idle', izquierda.accesorioIndexCabeza ?? -1, izquierda.accesorioIndexCuerpo ?? -1)
        left.applyLayout(cfg.width * 0.18, cfg.height / 2 + 10, -SCALE, SCALE)

        const rightArm = (this as any).add.armature('Armature', derecha.toka)
        right.mount(rightArm, derecha.animacion ?? 'idle', derecha.accesorioIndexCabeza ?? -1, derecha.accesorioIndexCuerpo ?? -1)
        right.applyLayout(cfg.width * 0.82, cfg.height / 2 + 10, SCALE, SCALE)
      }
    }

    return new Scene() as unknown as IBattleScene
  }