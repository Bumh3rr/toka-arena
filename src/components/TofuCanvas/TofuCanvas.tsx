import { useEffect, useRef } from 'react'
import type { Tokagotchi, TokagotchiAnimacion } from '../../types/toka'
import styles from './TofuCanvas.module.css'

interface TokagotchiCanvasProps {
  tokagotchi: Tokagotchi
  animacion?: TokagotchiAnimacion
  width?: number
  height?: number
  scale?: number
}

export default function TokagotchiCanvas({
  tokagotchi,
  animacion = 'idle',
  width = 320,
  height = 320,
  scale = 0.55
}: TokagotchiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<any>(null)
  const armatureRef = useRef<any>(null)

  // Inicializar Phaser + DragonBones
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const Phaser = (window as any).Phaser
    const db = (window as any).dragonBones

    if (!Phaser || !db) {
      console.error('Phaser o DragonBones no están disponibles')
      return
    }

    const { assets, accesorios } = tokagotchi

    class TokagotchiScene extends Phaser.Scene {
      constructor() {
        super({ key: `TokagotchiScene_${tokagotchi.id}` })
      }

      preload() {
        this.load.dragonbone(
          assets.armatureKey,
          assets.texPng,
          assets.texJson,
          assets.skeJson
        )
      }

      create() {
        const { width: w, height: h } = this.scale

        const armature = (this as any).add.armature('Armature', assets.armatureKey)
        armature.x = w / 2
        armature.y = h / 2
        armature.scaleX = scale
        armature.scaleY = scale

        // Aplicar animación inicial
        armature.animation.play(animacion, 0)

        // Aplicar accesorios iniciales
        if (accesorios.cabeza) {
          const slotCabeza = armature.armature.getSlot('accesorios_cabeza')
          if (slotCabeza) slotCabeza.displayIndex = accesorios.cabeza.displayIndex
        }

        if (accesorios.cuerpo) {
          const slotCuerpo = armature.armature.getSlot('accesorios_cuerpo')
          if (slotCuerpo) slotCuerpo.displayIndex = accesorios.cuerpo.displayIndex
        }

        armatureRef.current = armature
      }
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width,
      height,
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
  }, [tokagotchi.id])

  // Cambiar animación en caliente
  useEffect(() => {
    const armature = armatureRef.current
    if (!armature) return
    armature.animation.fadeIn(animacion, 0.2, 0)
  }, [animacion])

  // Cambiar accesorio cabeza en caliente
  useEffect(() => {
    const armature = armatureRef.current
    if (!armature) return
    const slot = armature.armature.getSlot('accesorios_cabeza')
    if (slot) slot.displayIndex = tokagotchi.accesorios.cabeza?.displayIndex ?? 0
  }, [tokagotchi.accesorios.cabeza])

  // Cambiar accesorio cuerpo en caliente
  useEffect(() => {
    const armature = armatureRef.current
    if (!armature) return
    const slot = armature.armature.getSlot('accesorios_cuerpo')
    if (slot) slot.displayIndex = tokagotchi.accesorios.cuerpo?.displayIndex ?? 0
  }, [tokagotchi.accesorios.cuerpo])

  return (
    <div
      ref={containerRef}
      className={styles.canvas}
      style={{ width, height }}
    />
  )
}