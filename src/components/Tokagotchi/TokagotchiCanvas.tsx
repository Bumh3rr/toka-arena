import { useEffect, useRef } from 'react'
import { TokagotchiGame } from '../../game/TokagotchiGame'
import type { TokagotchiConfig } from '../../game/types'
import type { Especie, AssetsTokagotchi, AnimacionTokagotchi } from '../../types/tokagotchi'
import { getAssetsByEspecie } from '../../services/tokagotchiService'

interface TokagotchiCanvasProps {
  width?: number
  height?: number
  accesorioIndexCabeza?: number
  accesorioIndexCuerpo?: number
  animacionActual?: AnimacionTokagotchi
  especie?: Especie
  assets?: AssetsTokagotchi
  reverse?: boolean
}

export default function TokagotchiCanvas({
  width = 350,
  height = 310,
  accesorioIndexCabeza = -1,
  accesorioIndexCuerpo = -1,
  animacionActual = 'idle',
  especie = 'TOFU',
  assets,
  reverse = false
}: TokagotchiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<TokagotchiGame | null>(null)

  if (!assets) {
    console.info('Assets: ', assets)
    assets = getAssetsByEspecie(especie)
  }

  // Inicializar y destruir
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    if (!(window as any).Phaser || !(window as any).dragonBones) return

    const cfg: TokagotchiConfig = {
      width, height, assets, animacionActual,
      accesorioIndexCabeza, accesorioIndexCuerpo, reverse
    }

    gameRef.current = new TokagotchiGame(containerRef.current, cfg)

    return () => {
      gameRef.current?.destroy()
      gameRef.current = null
    }
  }, [])

  useEffect(() => { gameRef.current?.setAnimation(animacionActual) }, [animacionActual])
  useEffect(() => { gameRef.current?.setAccesorioCabeza(accesorioIndexCabeza) }, [accesorioIndexCabeza])
  useEffect(() => { gameRef.current?.setAccesorioCuerpo(accesorioIndexCuerpo) }, [accesorioIndexCuerpo])
  useEffect(() => { gameRef.current?.resize(width, height, reverse) }, [width, height, reverse])

  return <div ref={containerRef} style={{ width, height }} />
}