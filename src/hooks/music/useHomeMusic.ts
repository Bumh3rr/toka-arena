/**
 * Wrapper de compatibilidad sobre musicManager.
 * La música se gestiona globalmente desde useAppMusic (montado en AppLayout);
 * este hook solo expone los controles de volumen y mute para componentes
 * que necesiten acceso puntual.
 */
import { musicManager } from './musicManager'

export function useHomeMusic() {
  const setVolume = (v: number) => {
    const h = (musicManager as any).sounds?.get('home')
    h?.volume(v)
  }

  return {
    stop:      () => musicManager.stopAll(),
    setMuted:  (v: boolean) => musicManager.setMuted(v),
    setVolume,
  }
}
