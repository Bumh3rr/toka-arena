import { useEffect, useRef } from 'react'
import styles from './EggCanvas.module.css'

interface EggCanvasProps {
  onAnimationComplete: () => void
}

export default function EggCanvas({ onAnimationComplete }: EggCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const Phaser = (window as any).Phaser
    if (!Phaser) return

    class EggScene extends Phaser.Scene {
      private egg!: any
      private particles!: any
      private onComplete: () => void

      constructor() {
        super({ key: 'EggScene' })
        this.onComplete = onAnimationComplete
      }

      preload() {
        this.load.image('egg', '/assets/egg/egg.png')
      }

      create() {
        const { width, height } = this.scale

        this.egg = this.add.image(width / 2, height / 2, 'egg')
        this.egg.setScale(0.6)

        // Secuencia de animación
        this.playEggAnimation()
      }

      playEggAnimation() {
        // const { width, height } = this.scale

        // Fase 1: shake rápido
        this.tweens.add({
          targets: this.egg,
          x: { from: this.egg.x - 12, to: this.egg.x + 12 },
          yoyo: true,
          repeat: 6,
          duration: 80,
          ease: 'Sine.easeInOut',
          onComplete: () => this.playCrackAnimation()
        })
      }

      playCrackAnimation() {
        // Fase 2: escala up + shake más fuerte
        this.tweens.add({
          targets: this.egg,
          scaleX: 0.75,
          scaleY: 0.75,
          duration: 200,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.tweens.add({
              targets: this.egg,
              angle: { from: -15, to: 15 },
              yoyo: true,
              repeat: 4,
              duration: 60,
              ease: 'Sine.easeInOut',
              onComplete: () => this.playExplosion()
            })
          }
        })
      }

      playExplosion() {
        const { width, height } = this.scale

        // Fase 3: destello blanco + desaparece
        const flash = this.add.rectangle(width / 2, height / 2, width, height, 0xffffff, 0)
        flash.setDepth(10)

        this.tweens.add({
          targets: this.egg,
          scaleX: 1.4,
          scaleY: 1.4,
          alpha: 0,
          duration: 300,
          ease: 'Power2',
        })

        this.tweens.add({
          targets: flash,
          alpha: { from: 0, to: 1 },
          duration: 200,
          yoyo: true,
          onComplete: () => {
            // Llamar callback para ir a fase 3
            setTimeout(() => this.onComplete(), 200)
          }
        })
      }
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: 300,
      height: 300,
      transparent: true,
      parent: containerRef.current,
      scene: [EggScene]
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} className={styles.canvas} />
}