// src/components/TokagotchiCanvas/TokagotchiCanvas.tsx
import { useEffect, useRef } from 'react'
import type { Tokagotchi, TokagotchiAnimacion } from '../../types/toka'
import styles from './TofuCanvas.module.css'

// ── SINGLETON: un solo juego Phaser, múltiples escenas ────────────────────
let globalGame:    any     = null
let gameContainer: Element | null = null

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
  width  = 320,
  height = 320,
  scale  = 0.55
}: TokagotchiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const armatureRef  = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const Phaser = (window as any).Phaser
    const db     = (window as any).dragonBones
    if (!Phaser || !db) {
      console.error('[TokagotchiCanvas] Phaser o DragonBones no disponibles')
      return
    }

    const { assets, accesorios } = tokagotchi
    let destroyed  = false
    const sceneKey = `Toka_${tokagotchi.id}_${assets.armatureKey}`

    // ── Definir escena ───────────────────────────────────────────────────
    class TokagotchiScene extends Phaser.Scene {
      constructor() { super({ key: sceneKey }) }

      preload(this: any) {
        this.load.dragonbone(
          assets.armatureKey,
          assets.texPng,
          assets.texJson,
          assets.skeJson
        )
      }

      create(this: any) {
        const { width: w, height: h } = this.scale
        const tryCreate = () => {
          if (destroyed) return
          if (!this.dragonbone?.factory) {
            this.time.delayedCall(50, tryCreate)
            return
          }
          const armature = this.add.armature('Armature', assets.armatureKey)
          armature.x      = w / 2
          armature.y      = h / 2
          armature.scaleX = scale
          armature.scaleY = scale
          armature.animation.play(animacion, 0)

          if (accesorios?.cabeza) {
            const slot = armature.armature.getSlot('accesorios_cabeza')
            if (slot) slot.displayIndex = accesorios.cabeza.displayIndex
          }
          if (accesorios?.cuerpo) {
            const slot = armature.armature.getSlot('accesorios_cuerpo')
            if (slot) slot.displayIndex = accesorios.cuerpo.displayIndex
          }
          armatureRef.current = armature
        }
        tryCreate()
      }
    }

    const timer = setTimeout(() => {
      if (destroyed || !containerRef.current) return

      // ── Ya existe un juego global ─────────────────────────────────────
      if (globalGame && !globalGame.isDestroyed) {

        // Mover el canvas al contenedor actual
        const canvas = globalGame.canvas
        if (canvas && containerRef.current) {
          containerRef.current.appendChild(canvas)
          gameContainer = containerRef.current
          globalGame.scale.resize(width, height)
        }

        // Quitar escena previa del mismo key si existe
        if (globalGame.scene.getScene(sceneKey)) {
          globalGame.scene.remove(sceneKey)
        }

        setTimeout(() => {
          if (destroyed) return
          globalGame.scene.add(sceneKey, TokagotchiScene, true)
        }, 30)

        return
      }

      // ── Primera vez: crear juego con plugin en la config ──────────────
      gameContainer = containerRef.current
      globalGame = new Phaser.Game({
        type:        Phaser.AUTO,
        width,
        height,
        transparent: true,
        parent:      gameContainer,
        plugins: {
          scene: [{
            key:     'DragonBones',
            plugin:  db.phaser.plugin.DragonBonesScenePlugin,
            mapping: 'dragonbone',
            start:   true,
          }]
        },
        scene: [TokagotchiScene]
      })
    }, 50)

    return () => {
      destroyed = true
      clearTimeout(timer)
      armatureRef.current = null
      // NO destruir el juego global — solo remover la escena
      try {
        if (globalGame && !globalGame.isDestroyed) {
          globalGame.scene.remove(sceneKey)
        }
      } catch (e) {}
    }
  }, [tokagotchi.id])

  // ── Animación en caliente ──────────────────────────────────────────────
  useEffect(() => {
    try { armatureRef.current?.animation?.fadeIn(animacion, 0.2, 0) } catch (e) {}
  }, [animacion])

  // ── Accesorios en caliente ─────────────────────────────────────────────
  useEffect(() => {
    try {
      const slot = armatureRef.current?.armature?.getSlot('accesorios_cabeza')
      if (slot) slot.displayIndex = tokagotchi.accesorios?.cabeza?.displayIndex ?? 0
    } catch (e) {}
  }, [tokagotchi.accesorios?.cabeza])

  useEffect(() => {
    try {
      const slot = armatureRef.current?.armature?.getSlot('accesorios_cuerpo')
      if (slot) slot.displayIndex = tokagotchi.accesorios?.cuerpo?.displayIndex ?? 0
    } catch (e) {}
  }, [tokagotchi.accesorios?.cuerpo])

  return (
    <div
      ref={containerRef}
      className={styles.canvas}
      style={{ width, height }}
    />
  )
}