/**
 * Hook que gestiona qué pista suena según la ruta activa.
 * Debe montarse UNA SOLA VEZ en AppLayout para que la música
 * no se interrumpa al navegar entre páginas.
 * También pausa la música cuando la pestaña queda oculta y la reanuda al volver :)
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { musicManager } from './musicManager'

const BATTLE_PATHS = ['/arena']

function isBattlePath(pathname: string) {
  return BATTLE_PATHS.some(p => pathname.startsWith(p))
}

export function useAppMusic() {
  const { pathname } = useLocation()

  // Arranque inicial: empieza la pista correcta según la ruta de entrada
  useEffect(() => {
    if (!musicManager.muted) {
      musicManager.play(isBattlePath(pathname) ? 'battle' : 'home')
    }
    return () => musicManager.stopAll() // Al desmontar AppLayout (logout) detiene todo
  }, [])

  // Cambio de ruta: hace crossfade entre pistas si cambia el contexto
  useEffect(() => {
    if (musicManager.muted) return
    musicManager.play(isBattlePath(pathname) ? 'battle' : 'home')
  }, [pathname])

  // Pausa / reanuda cuando la pestaña entra/sale del foco
  useEffect(() => {
    const onVisChange = () => {
      if (document.hidden) musicManager.pauseAll()
      else musicManager.resumeActive()
    }
    document.addEventListener('visibilitychange', onVisChange)
    return () => document.removeEventListener('visibilitychange', onVisChange)
  }, [])
}
