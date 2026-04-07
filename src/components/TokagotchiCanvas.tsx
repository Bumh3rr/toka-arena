import { useEffect, useRef } from 'react'

interface Props {
  accesorioIndexCabeza?: number,
  accesorioIndexCuerpo?: number
}

export default function TokagotchiCanvas({ accesorioIndexCabeza = -1, accesorioIndexCuerpo = -1 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<any>(null)
  const armatureRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const Phaser = (window as any).Phaser
    const db = (window as any).dragonBones

    if (!Phaser || !db) {
      console.error('Phaser o DragonBones no están disponibles')
      return
    }

    class TokagotchiScene extends Phaser.Scene {
      constructor() {
        super({ key: 'TokagotchiScene' })
      }

      preload() {
        this.load.dragonbone(
          'mochi',
          '/assets/mochi/mochi_tex.png',
          '/assets/mochi/mochi_tex.json',
          '/assets/mochi/mochi_ske.json'
        )
      }

      create() {
        const armature = (this as any).add.armature('Armature', 'mochi')
        armature.x = 300
        armature.y = 350
        armature.scaleX = 0.5
        armature.scaleY = 0.5
        armature.animation.play('idle', 0)

        // Guardar referencia al armature
        armatureRef.current = armature
        ;(window as any).tokagotchiScene = this

        if (accesorioIndexCabeza !== -1) {
          // Aplicar accesorio inicial
          const slot = armature.armature.getSlot('accesorios-cabeza')
          if (slot) slot.displayIndex = accesorioIndexCabeza
        }

        if (accesorioIndexCuerpo !== -1) {
          // Aplicar accesorio inicial
          const slot = armature.armature.getSlot('accesorios-cuerpo')
          if (slot) slot.displayIndex = accesorioIndexCuerpo
        }
      }
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: 600,
      height: 600,
      transparent: true,
      parent: containerRef.current,
      plugins: {
        scene: [{
          key: 'DragonBones',
          plugin: db.phaser.plugin.DragonBonesScenePlugin,
          mapping: 'dragonbone'
        }]
      },
      scene: [TokagotchiScene]
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
      armatureRef.current = null
    }
  }, [])

  // Cambiar accesorio cuando cambia la prop
  useEffect(() => {
    const armature = armatureRef.current
    if (!armature) return
    const slot = armature.armature.getSlot('accesorios-cabeza')
    if (slot) slot.displayIndex = accesorioIndexCabeza
  }, [accesorioIndexCabeza])

  // Cambiar accesorio del cuerpo cuando cambia la prop
  useEffect(() => {
    const armature = armatureRef.current
    if (!armature) return
    const slot = armature.armature.getSlot('accesorios-cuerpo')
    if (slot) slot.displayIndex = accesorioIndexCuerpo
  }, [accesorioIndexCuerpo])

  return <div ref={containerRef} style={{ width: 600, height: 600 }} />
}