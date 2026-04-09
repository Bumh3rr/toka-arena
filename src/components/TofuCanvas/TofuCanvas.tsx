// src/components/TokagotchiCanvas/TokagotchiCanvas.tsx
import { useEffect, useRef, useState } from 'react'
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
  width  = 320,
  height = 320,
  scale  = 0.55
}: TokagotchiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<any>(null)
  const armatureRef  = useRef<any>(null)
  const [showStaticFallback, setShowStaticFallback] = useState(false)

  const staticImageSrc = `/assets/tokagotchis/${tokagotchi.especie}.png`

  useEffect(() => {
    // Reset fallback when changing tokagotchi/assets so we can retry animation.
    setShowStaticFallback(false)
  }, [
    tokagotchi.id,
    tokagotchi.assets.armatureKey,
    tokagotchi.assets.texPng,
    tokagotchi.assets.texJson,
    tokagotchi.assets.skeJson
  ])

  useEffect(() => {
    if (!containerRef.current) return

    const Phaser = (window as any).Phaser
    const db     = (window as any).dragonBones
    if (!Phaser || !db) {
      console.error('[TokagotchiCanvas] Phaser o DragonBones no disponibles')
      setShowStaticFallback(true)
      return
    }

    const { assets, accesorios } = tokagotchi
    let destroyed = false
    let loadFailed = false
    const runtimeInstanceId = `db_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
    const sceneKey = `Toka_${tokagotchi.id}_${assets.armatureKey}_${runtimeInstanceId}`
    const pluginKey = `DragonBones_${runtimeInstanceId}`
    const armatureName = 'Armature'

    // ── Definir escena ───────────────────────────────────────────────────
    class TokagotchiScene extends Phaser.Scene {
      constructor() { super({ key: sceneKey }) }

      preload(this: any) {
        // Prevent stale DragonBones cache entries from mixing atlas/texture/bone data.
        try {
          if (this.textures?.exists?.(assets.armatureKey)) {
            this.textures.remove(assets.armatureKey)
          }

          if (this.cache?.json?.exists?.(`${assets.armatureKey}_atlasjson`)) {
            this.cache.json.remove(`${assets.armatureKey}_atlasjson`)
          }

          if (this.cache?.custom?.dragonbone?.has?.(assets.armatureKey)) {
            this.cache.custom.dragonbone.remove(assets.armatureKey)
          }
        } catch (e) {
          console.warn('[TokagotchiCanvas] No se pudo limpiar cache previa DragonBones:', e)
        }

        this.load.on('loaderror', (file: any) => {
          loadFailed = true
          console.error('[TokagotchiCanvas] Error cargando asset DragonBones:', file?.src ?? file)
        })

        this.load.dragonbone(
          assets.armatureKey,
          assets.texPng,
          assets.texJson,
          assets.skeJson
        )
      }

      create(this: any) {
        const { width: w, height: h } = this.scale
        let retries = 0
        const maxRetries = 20
        let recoveryLoads = 0
        const maxRecoveryLoads = 2
        let isRecovering = false

        const tryCreate = () => {
          if (destroyed) return
          if (loadFailed) return

          if (!this.dragonbone?.factory) {
            if (retries < maxRetries) {
              retries += 1
              this.time.delayedCall(50, tryCreate)
            }
            return
          }

          const hasData = this.dragonbone.factory.getDragonBonesData(assets.armatureKey)
          if (!hasData) {
            const hasTexture = this.textures?.exists?.(assets.armatureKey)
            const hasAtlasJson = this.cache?.json?.exists?.(`${assets.armatureKey}_atlasjson`)

            if (!isRecovering && recoveryLoads < maxRecoveryLoads) {
              isRecovering = true
              recoveryLoads += 1

              // Recovery path: reload dragonbones files in runtime when cache is incomplete.
              this.load.once('complete', () => {
                isRecovering = false
                this.time.delayedCall(60, tryCreate)
              })

              this.load.once('loaderror', () => {
                isRecovering = false
              })

              this.load.dragonbone(
                assets.armatureKey,
                assets.texPng,
                assets.texJson,
                assets.skeJson
              )
              this.load.start()
              return
            }

            if (retries < maxRetries) {
              retries += 1
              this.time.delayedCall(50, tryCreate)
            } else {
              console.error('[TokagotchiCanvas] DragonBonesData no disponible:', assets.armatureKey, {
                hasTexture,
                hasAtlasJson,
                recoveryLoads
              })
            }
            return
          }

          let armature: any = null
          try {
            armature = this.add.armature(armatureName, assets.armatureKey)
          } catch (err) {
            console.error('[TokagotchiCanvas] Error creando armature display:', err)
            setShowStaticFallback(true)
            return
          }

          if (!armature) {
            console.error('[TokagotchiCanvas] Armature no pudo inicializarse')
            setShowStaticFallback(true)
            return
          }

          armature.x      = w / 2
          armature.y      = h / 2
          armature.scaleX = scale
          armature.scaleY = scale
          armature.animation.play(resolveAnimationName(animacion), 0)

          if (accesorios?.cabeza) {
            const slot = armature.armature.getSlot('accesorios_cabeza')
            if (slot) slot.displayIndex = accesorios.cabeza.displayIndex
          }
          if (accesorios?.cuerpo) {
            const slot = armature.armature.getSlot('accesorios_cuerpo')
            if (slot) slot.displayIndex = accesorios.cuerpo.displayIndex
          }
          armatureRef.current = armature
          setShowStaticFallback(false)
        }
        tryCreate()
      }
    }

    const fallbackTimer = window.setTimeout(() => {
      if (destroyed) return
      if (!armatureRef.current) {
        setShowStaticFallback(true)
      }
    }, 2200)

    gameRef.current = new Phaser.Game({
      type:        Phaser.AUTO,
      width,
      height,
      transparent: true,
      parent:      containerRef.current,
      plugins: {
        scene: [{
          key:     pluginKey,
          plugin:  db.phaser.plugin.DragonBonesScenePlugin,
          mapping: 'dragonbone',
          start:   true,
        }]
      },
      scene: [TokagotchiScene]
    })

    return () => {
      destroyed = true
      window.clearTimeout(fallbackTimer)
      armatureRef.current = null
      try {
        if (gameRef.current && !gameRef.current.isDestroyed) {
          gameRef.current.destroy(true)
        }
      } catch (e) {
        console.error('[TokagotchiCanvas] Error destruyendo instancia Phaser:', e)
      } finally {
        gameRef.current = null
      }
    }
  }, [
    tokagotchi.id,
    tokagotchi.assets.armatureKey,
    tokagotchi.assets.texPng,
    tokagotchi.assets.texJson,
    tokagotchi.assets.skeJson,
    width,
    height,
    scale
  ])

  // ── Animación en caliente ──────────────────────────────────────────────
  useEffect(() => {
    try { armatureRef.current?.animation?.fadeIn(resolveAnimationName(animacion), 0.2, 0) } catch (e) {}
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
    <div className={styles.canvasWrapper} style={{ width, height }}>
      <div
        ref={containerRef}
        className={styles.canvas}
        style={{ width, height }}
      />

      {showStaticFallback && (
        <img
          src={staticImageSrc}
          alt={tokagotchi.nombre}
          className={styles.staticFallback}
          onError={() => {
            // Keep canvas hidden if static fallback image is also unavailable.
            console.error('[TokagotchiCanvas] Fallback estático no disponible:', staticImageSrc)
          }}
        />
      )}
    </div>
  )
}

function resolveAnimationName(animacion: TokagotchiAnimacion): string {
  const animationMap: Record<TokagotchiAnimacion, string> = {
    idle: 'idle',
    battle_idle: 'idle',
    play: 'jugar',
    heal: 'curacion',
    bath: 'bañar',
    attack: 'ataque',
    hurt: 'daño',
    feed: 'comer',
    ko: 'daño',
    win: 'jugar'
  }

  return animationMap[animacion] ?? 'idle'
}