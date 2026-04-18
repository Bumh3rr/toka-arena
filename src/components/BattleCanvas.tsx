import { useEffect, useRef } from 'react'
  import { BattleGame } from '../game/BattleGame'
  import type { TokagotchiSide } from '../game/types'

  interface Props {
    izquierda: TokagotchiSide
    derecha: TokagotchiSide
    width?: number
    height?: number,
    className?: string
  }

  export default function BattleCanvas({ izquierda, derecha, width = 600, height = 400, className }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<BattleGame | null>(null)

    useEffect(() => {
      if (!containerRef.current || gameRef.current) return
      if (!(window as any).Phaser || !(window as any).dragonBones) return

      gameRef.current = new BattleGame(containerRef.current, { width, height, izquierda, derecha })

      return () => { gameRef.current?.destroy(); gameRef.current = null }
    }, [])

    useEffect(() => { gameRef.current?.setLeftAnimation(izquierda.animacion ?? 'idle', izquierda.bucleAnimacion ?? 0) }, [izquierda.animacion, izquierda.bucleAnimacion])
    useEffect(() => { gameRef.current?.setLeftAccesorioCabeza(izquierda.accesorioIndexCabeza ?? -1) }, [izquierda.accesorioIndexCabeza])
    useEffect(() => { gameRef.current?.setLeftAccesorioCuerpo(izquierda.accesorioIndexCuerpo ?? -1) }, [izquierda.accesorioIndexCuerpo])

    useEffect(() => { gameRef.current?.setRightAnimation(derecha.animacion ?? 'idle', derecha.bucleAnimacion ?? 0) }, [derecha.animacion, derecha.bucleAnimacion])
    useEffect(() => { gameRef.current?.setRightAccesorioCabeza(derecha.accesorioIndexCabeza ?? -1) }, [derecha.accesorioIndexCabeza])
    useEffect(() => { gameRef.current?.setRightAccesorioCuerpo(derecha.accesorioIndexCuerpo ?? -1) }, [derecha.accesorioIndexCuerpo])

    return <div ref={containerRef} style={{ width, height }} className={className} />
  }