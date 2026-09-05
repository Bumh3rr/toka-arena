import { applyAccessories } from '@/shared/render/applyAccessories'
import type { TokagotchiConfig } from './types'
import type { EquippedAccessory } from '@/shared/domain/accessory'

/** API pública expuesta por la escena de Phaser al wrapper `TokagotchiGame` y al componente React. */
export interface ITokagotchiScene {
  /** Cambia la animación activa. Si el nombre no existe en el .ske.json DragonBones falla en silencio. */
  setAnimation(name: string): void
  /** Cambia los accesorios */
  setAccessories(arrays?: EquippedAccessory[]): void
  /** Reposiciona y rescala el armature cuando el tamaño del canvas cambia. */
  updateLayout(width: number, height: number, reverse: boolean): void
  /**
   * Pausa o reanuda la animación DragonBones mediante `timeScale`.
   *
   * Seguro ante llamadas previas al boot de Phaser: si se llama antes de que `create()`
   * haya corrido, el flag se almacena en el closure y se aplica al final de `create()`.
   */
  setPaused(paused: boolean): void
}

/**
 * Crea la escena Phaser que carga los assets de DragonBones y controla el armature.
 *
 * Se usa la factoría en lugar de exportar la clase directamente para encapsular el
 * estado mutable (`armature`, `paused`) en un closure, evitando que el caller acceda
 * a internos de Phaser y manteniendo la interfaz limpia ({@link ITokagotchiScene}).
 */
export function createTokagotchiScene(cfg: TokagotchiConfig): ITokagotchiScene {
  const Phaser = (window as any).Phaser
  /** Referencia al ArmatureDisplay de DragonBones. `null` hasta que `create()` corra. */
  let armature: any = null
  /** Flag de pausa; puede setearse antes del boot — se aplica al final de `create()`. */
  let paused = false

  function applyLayout() {
    if (!armature) return
    const scale = Math.max(0.2, Math.min(cfg.width, cfg.height) / 700)
    armature.x = cfg.width / 2
    armature.y = cfg.height / 2
    armature.scaleX = cfg.reverse ? -scale : scale
    armature.scaleY = scale
  }

  class Scene extends Phaser.Scene {
    constructor() {
      super({ key: 'TokagotchiScene' })
    }

    preload() {
      const { assets } = cfg
      ;(this.load as any).dragonbone(
        assets.armatureKey,
        assets.texPng,
        assets.texJson,
        assets.skeJson
      )
    }

    create() {
      armature = (this as any).add.armature('Armature', cfg.assets.armatureKey)
      applyLayout()
      armature.animation.play(cfg.animacionActual, 0)
      applyAccessories(armature, cfg.accessories)
      // Aplica el flag de pausa si fue seteado antes de que Phaser terminara de arrancar.
      if (paused) armature.animation.timeScale = 0
    }

    setAnimation(name: string) {
      cfg.animacionActual = name
      if (!armature) return
      armature.animation.play(name, 0)
      // Si está pausado, re-congela después de que play() restablece timeScale a 1.
      if (paused) armature.animation.timeScale = 0
    }

    setAccessories(arrays?: EquippedAccessory[]) {
      cfg.accessories = arrays
      applyAccessories(armature,arrays)
    }

    updateLayout(width: number, height: number, reverse: boolean) {
      cfg.width = width
      cfg.height = height
      cfg.reverse = reverse
      applyLayout()
    }

    setPaused(p: boolean) {
      paused = p
      // Guard: armature es null hasta que create() corra.
      // Si se llama antes del boot, el flag se aplica al final de create() arriba.
      if (!armature) return
      armature.animation.timeScale = p ? 0 : 1
    }

  }

  return new Scene() as unknown as ITokagotchiScene
}