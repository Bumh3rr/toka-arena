/**
 * Singleton que gestiona todas las pistas de música del juego.
 *
 * Vive fuera del árbol de React para que la música no se interrumpa
 * al montar/desmontar componentes durante la navegación.
 *
 * Uso:
 *   musicManager.play('home')       // cambia al track de home con fade
 *   musicManager.setMuted(true)     // silencia y persiste la preferencia
 *   musicManager.pauseAll()         // pausa sin perder el track activo
 *   musicManager.resumeActive()     // reanuda el track activo
 *   musicManager.stopAll()          // detiene todo (p.ej. al cerrar sesión)
 */
import { Howl } from 'howler'

export type TrackKey = 'home' | 'battle'

const STORAGE_KEY = 'toka_music_enabled'
const FADE_MS = 800

const TRACKS: Record<TrackKey, { src: string; volume: number }> = {
  home:   { src: '/assets/audio/bg_home.wav',   volume: 0.05 },
  battle: { src: '/assets/audio/bg_battle.mp3', volume: 0.15 },
}

class MusicManager {
  private sounds = new Map<TrackKey, Howl>()
  private activeKey: TrackKey | null = null
  private _muted: boolean

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY)
    this._muted = stored === 'false'
  }

  get muted() { return this._muted }

  /** Cambia al track indicado con fade cruzado. No hace nada si ya está activo. */
  play(key: TrackKey) {
    if (this.activeKey === key) return

    this.fadeOutActive()
    this.activeKey = key

    if (this._muted) return

    const h = this.getOrCreate(key)
    if (!h.playing()) h.play()
    h.fade(h.volume() as number, TRACKS[key].volume, FADE_MS)
  }

  /** Silencia o activa la música y persiste la preferencia en localStorage. */
  setMuted(muted: boolean) {
    this._muted = muted
    localStorage.setItem(STORAGE_KEY, String(!muted))

    if (muted) {
      this.sounds.forEach(h => {
        if (h.playing()) h.fade(h.volume() as number, 0, FADE_MS / 2)
      })
    } else if (this.activeKey) {
      const h = this.sounds.get(this.activeKey)
      if (h) {
        if (!h.playing()) h.play()
        h.fade(h.volume() as number, TRACKS[this.activeKey].volume, FADE_MS / 2)
      }
    }
  }

  /** Pausa toda la música (p.ej. tab oculta). No pierde el track activo. */
  pauseAll() {
    this.sounds.forEach(h => { if (h.playing()) h.pause() })
  }

  /** Reanuda el track activo si la música no está silenciada. */
  resumeActive() {
    if (!this.activeKey || this._muted) return
    const h = this.sounds.get(this.activeKey)
    if (h && !h.playing()) h.play()
  }

  /** Detiene todo y limpia el track activo (p.ej. logout). */
  stopAll() {
    this.sounds.forEach(h => h.stop())
    this.activeKey = null
  }

  // ── Internos ────────────────────────────────────────────────────────────────
  private getOrCreate(key: TrackKey): Howl {
    if (this.sounds.has(key)) return this.sounds.get(key)!

    const h = new Howl({
      src: [TRACKS[key].src],
      loop: true,
      volume: 0,
      onloaderror: () => {
        console.warn(`[MusicManager] No se pudo cargar "${TRACKS[key].src}"`)
      },
    })

    this.sounds.set(key, h)
    return h
  }

  private fadeOutActive() {
    if (!this.activeKey) return
    const prev = this.sounds.get(this.activeKey)
    if (prev?.playing()) {
      prev.fade(prev.volume() as number, 0, FADE_MS)
      setTimeout(() => prev.pause(), FADE_MS)
    }
  }
}

export const musicManager = new MusicManager() // Retorna la misma instancia en toda la app
