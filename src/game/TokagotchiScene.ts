  import type { TokagotchiConfig } from './types'

  export interface ITokagotchiScene {
    setAnimation(name: string): void
    setAccesorioCabeza(index: number): void
    setAccesorioCuerpo(index: number): void
    updateLayout(width: number, height: number, reverse: boolean): void
  }

  export function createTokagotchiScene(cfg: TokagotchiConfig): ITokagotchiScene {
    const Phaser = (window as any).Phaser
    let armature: any = null

    function applyLayout() {
      if (!armature) return
      const scale = Math.max(0.2, Math.min(cfg.width, cfg.height) / 700)
      armature.x = cfg.width / 2
      armature.y = cfg.height / 2
      armature.scaleX = cfg.reverse ? -scale : scale
      armature.scaleY = scale
    }

    function setSlot(slotName: string, index: number) {
      if (!armature || index === -1) return
      const slot = armature.armature.getSlot(slotName)
      if (slot) slot.displayIndex = index
    }

    class Scene extends Phaser.Scene {
      constructor() {
        super({ key: 'TokagotchiScene' })
      }
      preload() {
        const { tokaActual } = cfg
        ;(this.load as any).dragonbone(
          tokaActual,
          `/assets/${tokaActual}/${tokaActual}_tex.png`,
          `/assets/${tokaActual}/${tokaActual}_tex.json`,
          `/assets/${tokaActual}/${tokaActual}_ske.json`
        )
      }

      create() {
        armature = (this as any).add.armature('Armature', cfg.tokaActual)
        applyLayout()
        armature.animation.play(cfg.animacionActual, 0)
        setSlot('accesorios_cabeza', cfg.accesorioIndexCabeza)
        setSlot('accesorios_cuerpo', cfg.accesorioIndexCuerpo)
      }

      // Api para controlar la escena desde fuera
      setAnimation(name: string) {
        cfg.animacionActual = name
        armature?.animation.play(name, 0)
      }

      setAccesorioCabeza(index: number) {
        cfg.accesorioIndexCabeza = index
        setSlot('accesorios_cabeza', index)
      }

      setAccesorioCuerpo(index: number) {
        cfg.accesorioIndexCuerpo = index
        setSlot('accesorios_cuerpo', index)
      }

      updateLayout(width: number, height: number, reverse: boolean) {
        cfg.width = width
        cfg.height = height
        cfg.reverse = reverse
        applyLayout()
      }
    }

    return new Scene() as unknown as ITokagotchiScene
  }