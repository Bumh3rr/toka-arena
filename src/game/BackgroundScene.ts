/**
 * @file BackgroundScene.ts
 *
 * Escena de fondo del Home: paisaje estático con ciclo día/noche y movimiento ambiental mínimo.
 *
 * Rol en la arquitectura:
 *   BackgroundCanvas (React) → BackgroundGame (Phaser.Game) → createBackgroundScene (esta factory)
 *
 * El Home es una pantalla FIJA, no hay desplazamiento del personaje. El paisaje es
 * intencionalmente estático: antes había parallax lateral, pero el scroll infinito
 * y la repetición de texturas se veían mal en una pantalla fija, así que se eliminó.
 * El único movimiento continuo es:
 *   - Una nube que cruza lentamente de izquierda a derecha.
 *   - Luciérnagas que flotan de noche.
 *
 * El ciclo día/noche usa la hora real del dispositivo. Al cambiar de fase los colores
 * se interpolan con tweens en ~1.5 s; en la primera carga la transición es instantánea.
 *
 * Tipado: Phaser y sus helpers se leen de `window.Phaser` (cargado por CDN como global),
 * tipado como `any` por consistencia con TokagotchiScene.
 */

export interface IBackgroundScene {
  /**
   * Pausa o reanuda el loop de la escena.
   *
   * Seguro de llamar ANTES de que Phaser termine el boot (la escena aún no corrió `create()`):
   * el método comprueba que `this.tweens` y `this.time` existan antes de usarlos.
   * El flag `paused` se aplica al final de `create()` para cubrir la ventana de tiempo
   * en que el efecto de React ya llegó pero Phaser aún no inicializó los plugins.
   */
  setPaused(paused: boolean): void

  /**
   * Fuerza un re-layout inmediato cuando el contenedor cambia de tamaño.
   * Normalmente Phaser lo gestiona solo vía `Scale.RESIZE`; este método existe
   * para casos donde el cambio de tamaño viene de fuera del loop de Phaser.
   */
  updateLayout(width: number, height: number): void
}

/**
 * Configuración opcional pasada a `createBackgroundScene`.
 */
export interface BackgroundConfig {
  /**
   * DEV ONLY — fuerza una hora (0-23) para previsualizar fases sin esperar al reloj real.
   * No tiene efecto en producción si se omite.
   */
  hourOverride?: number
}

/** Las cuatro fases del ciclo día/noche, mapeadas a franjas horarias en `phaseForHour`. */
type Phase = 'amanecer' | 'dia' | 'atardecer' | 'noche'

/**
 * Representa una capa del paisaje dentro de la escena.
 * Puede ser una imagen cargada o un rectángulo de color (placeholder mientras no hay asset).
 */
interface LayerObj {
  obj: any
  type: 'image' | 'rect'
  /** Color base original; se multiplica contra el tint de la fase activa. */
  baseColor: number
  /** Nudge vertical en px para ajustar el horizonte. Negativo sube la capa, positivo la baja. */
  offsetY: number
}

/**
 * Factory que crea y devuelve la escena de fondo.
 *
 * Sigue el mismo patrón que `createTokagotchiScene`: devuelve una instancia de clase
 * que extiende `Phaser.Scene`, expuesta solo a través de `IBackgroundScene` para que
 * el caller no dependa de la implementación interna.
 *
 * @param cfg - Configuración opcional (ver `BackgroundConfig`).
 * @returns Instancia de la escena lista para pasar al array `scene` de `Phaser.Game`.
 */
export function createBackgroundScene(cfg: BackgroundConfig = {}): IBackgroundScene {
  const Phaser = (window as any).Phaser
  const Color = Phaser.Display.Color

  // ─────────────────────────────────────────────────────────
  // KNOB: Paletas por fase
  // Cada fase define: colores del gradiente de cielo (top/bot),
  // un tint multiplicativo para las capas del paisaje, y los
  // alphas finales de sol, luna y estrellas/luciérnagas.
  // Ajusta estos hex para afinar el mood de cada momento del día.
  // ─────────────────────────────────────────────────────────
  const PALETTES: Record<Phase, { top: number; bot: number; tint: number; sun: number; moon: number; stars: number }> = {
    amanecer:  { top: 0xFAC79A, bot: 0xFFE9C7, tint: 0xFFE3C8, sun: 1,   moon: 0,   stars: 0    },
    dia:       { top: 0xBFE3FF, bot: 0xEAF6FF, tint: 0xFFFFFF, sun: 1,   moon: 0,   stars: 0    },
    atardecer: { top: 0xF59B5E, bot: 0xFFD2A2, tint: 0xF3C39A, sun: 0.5, moon: 0.4, stars: 0.25 },
    noche:     { top: 0x18233F, bot: 0x33405E, tint: 0x5E6B95, sun: 0,   moon: 1,   stars: 1    },
  }

  // ─────────────────────────────────────────────────────────
  // KNOB: Capas del paisaje (fondo → frente)
  // Antes había far/mid/fg para el parallax lateral; como ya no
  // hay parallax ni animación por capa, queda una sola imagen
  // de paisaje completo anclada al fondo del canvas.
  // Si el path no carga → banda de color placeholder (color).
  // yFactor: posición Y relativa al alto del canvas (placeholder).
  // offsetY: ajuste vertical fino para alinear el horizonte (imagen).
  // ─────────────────────────────────────────────────────────
  const LAYER_DEFS = [
    { key: 'bg_fg',  path: '/assets/scene/op.png',  color: 0x4E7A30, yFactor: 0.82, offsetY: -16 },
  ]

  let sky: any = null
  let clouds: any = null
  let sun: any = null, moon: any = null, stars: any[] = []
  let layers: LayerObj[] = []
  let fireflies: any[] = []
  let paused = false
  let curPhase: Phase | null = null
  /** Claves de assets que fallaron al cargar; se usan en `has()` para decidir el fallback. */
  const missing = new Set<string>()

  /**
   * Mezcla multiplicativa de dos colores hexadecimales.
   * Se usa para aplicar el tint de fase sobre el color base de cada capa
   * sin sobreescribir su luminosidad original (igual que multiply en Photoshop).
   */
  const mul = (base: number, tint: number): number => {
    const a = Color.ValueToColor(base), b = Color.ValueToColor(tint)
    return Color.GetColor((a.red * b.red) / 255, (a.green * b.green) / 255, (a.blue * b.blue) / 255)
  }

  /**
   * Interpola linealmente entre dos colores hex usando la utilidad de Phaser.
   * `t` va de 0 (color origen) a 1 (color destino).
   */
  const lerpC = (from: number, to: number, t: number): number => {
    const c = Color.Interpolate.ColorWithColor(Color.ValueToColor(from), Color.ValueToColor(to), 100, t * 100)
    return Color.GetColor(c.r, c.g, c.b)
  }

  // ─────────────────────────────────────────────────────────
  // KNOB: Franjas horarias de cada fase.
  // amanecer: 05:00–07:59 | dia: 08:00–17:59 | atardecer: 18:00–20:59 | noche: resto
  // ─────────────────────────────────────────────────────────
  const phaseForHour = (h: number): Phase =>
    (h >= 5 && h < 8) ? 'amanecer' :
    (h >= 8 && h < 17) ? 'dia' :
    (h >= 17 && h < 21) ? 'atardecer' : 'noche'

  /** Devuelve la fase correspondiente a la hora actual (o al override de DEV). */
  const currentPhase = (): Phase => phaseForHour(cfg.hourOverride ?? new Date().getHours())

  class Scene extends Phaser.Scene {
    constructor() { super({ key: 'BackgroundScene' }) }

    preload() {
      // Registra los errores de carga para que `has()` pueda decidir
      // si renderizar el asset o el placeholder de color.
      this.load.on('loaderror', (file: any) => missing.add(file.key))
      LAYER_DEFS.forEach((l) => this.load.image(l.key, l.path))
      this.load.image('bg_clouds', '/assets/scene/clouds.png')
      this.load.image('bg_sun',    '/assets/scene/sun.png')
      this.load.image('bg_moon',   '/assets/scene/moon.png')
      // Las estrellas se ESTAMPAN (add.image × N) en posiciones aleatorias, NO como tileSprite.
      // tileSprite habría creado un patrón visible en cuadrícula; estampando se pueden
      // variar posición, tamaño, rotación y brillo por estrella.
      this.load.image('bg_stars', '/assets/scene/stars.png')
    }

    create() {
      const W = this.scale.width, H = this.scale.height
      /** Devuelve true si el asset cargó sin error y existe en el cache de texturas. */
      const has = (k: string) => this.textures.exists(k) && !missing.has(k)

      // ── Cielo ─────────────────────────────────────────────
      // Graphics en profundidad 0 para que quede detrás de todo.
      // Se limpia y redibuja en cada transición de fase (ver drawSky).
      sky = this.add.graphics().setDepth(0)

      // ── Estrellas ─────────────────────────────────────────
      // KNOB: STAR_COUNT = número de estrellas. Cada una tiene tamaño (18-28 px),
      // rotación y brillo (maxAlpha) aleatorios para que no parezcan clones.
      // Alpha inicial 0; se animan a maxAlpha*p.stars al entrar en fase noche/atardecer.
      if (has('bg_stars')) {
        const STAR_COUNT = 30
        for (let i = 0; i < STAR_COUNT; i++) {
          const s = this.add.image(
            Phaser.Math.Between(0, W),
            Phaser.Math.Between(0, Math.round(H * 0.55)),   // solo en el área del cielo
            'bg_stars',
          ).setDepth(0.3).setAlpha(0)
          const sizePx = Phaser.Math.FloatBetween(18, 28)   // KNOB: rango de tamaño de estrella
          s.setScale(sizePx / s.width)
          s.setAngle(Phaser.Math.Between(0, 360))
          s.setData('maxAlpha', Phaser.Math.FloatBetween(0.5, 1))
          stars.push(s)
        }
      }

      // ── Sol y luna ────────────────────────────────────────
      // KNOB: posición X/Y relativa al canvas (ajusta los factores 0.78, 0.22, etc.)
      // Si no hay asset se dibuja un círculo de color como fallback.
      sun  = has('bg_sun')  ? this.add.image(W * 0.78, H * 0.22, 'bg_sun').setDepth(0.4)  : this.add.circle(W * 0.78, H * 0.22, 26, 0xFFD25A).setDepth(0.4)
      moon = has('bg_moon') ? this.add.image(W * 0.22, H * 0.20, 'bg_moon').setDepth(0.4) : this.add.circle(W * 0.22, H * 0.20, 22, 0xEAF0FF).setDepth(0.4)

      // ── Nube ──────────────────────────────────────────────
      // Una sola imagen (no tileSprite) que cruza lento. La posición X se actualiza
      // en update(); al salir por la derecha reaparece por la izquierda.
      // KNOB: posición Y → H * 0.16 (ajusta para subir/bajar la nube)
      clouds = has('bg_clouds') ? this.add.image(W * 0.3, H * 0.16, 'bg_clouds').setDepth(0.6) : null

      // ── Capas del paisaje ─────────────────────────────────
      // Imagen estática anclada al borde inferior del canvas (origin 0.5, 1).
      // Se escala para cubrir el ancho del contenedor; offsetY ajusta el horizonte.
      // Si la imagen no cargó → rectángulo de color placeholder.
      LAYER_DEFS.forEach((l, i) => {
        if (has(l.key)) {
          const img = this.add.image(W / 2, H + l.offsetY, l.key).setOrigin(0.5, 1).setDepth(1 + i)
          img.setScale(W / img.width)
          layers.push({ obj: img, type: 'image', baseColor: 0xffffff, offsetY: l.offsetY })
        } else {
          const rect = this.add.rectangle(0, H * l.yFactor, W, H, l.color).setOrigin(0, 0).setDepth(1 + i)
          layers.push({ obj: rect, type: 'rect', baseColor: l.color, offsetY: 0 })
        }
      })

      // ── Luciérnagas ───────────────────────────────────────
      // Círculos pequeños con tween yoyo infinito. Alpha 0 por defecto;
      // aparecen solo durante atardecer/noche (controlado por p.stars en applyPhase).
      // KNOB: cantidad (7), rango de Y (H * 0.2 → H * 0.7), radio (2.5 px), color (0xFFF3A0)
      for (let i = 0; i < 7; i++) {
        const f = this.add.circle(
          Phaser.Math.Between(20, W - 20),
          Phaser.Math.Between(H * 0.2, H * 0.7), 2.5, 0xFFF3A0,
        ).setDepth(5).setAlpha(0)
        this.tweens.add({
          targets: f, y: f.y - Phaser.Math.Between(10, 30), x: f.x + Phaser.Math.Between(-15, 15),
          duration: Phaser.Math.Between(2200, 4200), yoyo: true, repeat: -1, ease: 'Sine.inOut',
        })
        fireflies.push(f)
      }

      // Aplica la fase actual de forma instantánea (sin tween) en la primera carga.
      this.applyPhase(currentPhase(), true)
      // Revisa la hora cada 60 s para detectar cambios de fase durante la sesión.
      this.time.addEvent({ delay: 60000, loop: true, callback: () => this.applyPhase(currentPhase(), false) })
      this.scale.on('resize', (gs: any) => this.relayout(gs.width, gs.height))

      // GOTCHA: el efecto `paused` de React puede llegar ANTES de que Phaser termine
      // el boot (this.tweens y this.time serían undefined si se llamara desde setPaused).
      // Por eso setPaused guarda el flag en la variable de closure y aquí, al final de
      // create(), se aplica el estado que haya acumulado.
      if (paused) { this.tweens.pauseAll(); this.time.paused = true }

      // TODO: parallax sutil por giroscopio (offset pequeño en X, NO scroll continuo)
      // TODO: partículas de hojas/pétalos de día (además de las luciérnagas de noche)
      // TODO: árboles que se mecen → animarlo en el arte de cada capa, no moviendo la capa entera
    }

    /**
     * Redibuja el gradiente del cielo con los colores indicados.
     * Se llama en cada frame del tween de transición (desde `applyPhase`)
     * y al cambiar de tamaño (desde `relayout`).
     */
    drawSky(top: number, bot: number) {
      const W = this.scale.width, H = this.scale.height
      sky.clear()
      sky.fillGradientStyle(top, top, bot, bot, 1)
      sky.fillRect(0, 0, W, H)
    }

    /**
     * Transiciona todos los elementos visuales a la paleta de la fase indicada.
     *
     * En cada frame del tween se interpolan:
     *   - El gradiente del cielo (top/bot) vía `drawSky`.
     *   - El tint multiplicativo de las capas del paisaje.
     *   - Los alphas de sol, luna, estrellas y luciérnagas.
     *
     * @param phase   - Fase objetivo.
     * @param instant - `true` en la carga inicial (sin tween, sin parpadeo).
     */
    applyPhase(phase: Phase, instant: boolean) {
      const p = PALETTES[phase]
      // Usa la fase actual como punto de partida; en la primera llamada (curPhase = null)
      // toma la misma fase destino para que lerpC(from, to, 0..1) empiece en el color correcto.
      const fromTop  = PALETTES[curPhase ?? phase].top
      const fromBot  = PALETTES[curPhase ?? phase].bot
      const fromTint = PALETTES[curPhase ?? phase].tint
      curPhase = phase
      const dur = instant ? 0 : 1500  // KNOB: duración de la transición de fase en ms

      const render = (t: number) => {
        this.drawSky(lerpC(fromTop, p.top, t), lerpC(fromBot, p.bot, t))
        const tint = lerpC(fromTint, p.tint, t)
        layers.forEach((L) => L.type === 'rect' ? L.obj.setFillStyle(mul(L.baseColor, tint)) : L.obj.setTint(tint))
        if (clouds && clouds.setTint) clouds.setTint(tint)
      }

      if (instant) {
        render(1)
      } else {
        // Objeto dummy para que el tween de Phaser anime `t` de 0 a 1;
        // en onUpdate se recalculan todos los colores interpolados.
        const drv = { t: 0 }
        this.tweens.add({ targets: drv, t: 1, duration: dur, ease: 'Sine.inOut', onUpdate: () => render(drv.t) })
      }
      // Los alphas de astros/estrellas/luciérnagas van en tweens separados para
      // poder ajustar su curva o duración de forma independiente en el futuro.
      this.tweens.add({ targets: sun,  alpha: p.sun,  duration: dur || 1 })
      this.tweens.add({ targets: moon, alpha: p.moon, duration: dur || 1 })
      stars.forEach((s) => this.tweens.add({ targets: s, alpha: p.stars * s.getData('maxAlpha'), duration: dur || 1 }))
      fireflies.forEach((f) => this.tweens.add({ targets: f, alpha: p.stars, duration: dur || 1 }))
    }

    /**
     * Reposiciona y reescala los elementos cuando cambia el tamaño del canvas.
     * Solo afecta a las capas de tipo 'image'; los elementos tipo 'rect' se estiran
     * automáticamente porque cubren el 100% del canvas.
     */
    relayout(W: number, H: number) {
      // El cielo se redibuja con los colores de la fase activa (no hay que interpolar aquí).
      if (curPhase) this.drawSky(PALETTES[curPhase].top, PALETTES[curPhase].bot)
      layers.forEach((L) => {
        if (L.type === 'image') {
          // Anclada abajo-centro; offsetY ajusta el horizonte sin cambiar el origen.
          L.obj.setScale(W / L.obj.width)
          L.obj.x = W / 2
          L.obj.y = H + L.offsetY
        }
      })
    }

    update(_t: number, delta: number) {
      if (paused || !clouds) return
      // Mueve la nube a velocidad constante independiente del framerate (delta-time).
      // KNOB: factor 0.03 = velocidad en px/frame a 60fps (sube para nube más rápida)
      const k = delta / 16.67
      clouds.x += 0.03 * k
      // Al salir completamente por la derecha, reaparece por la izquierda.
      const halfW = clouds.displayWidth / 2
      if (clouds.x - halfW > this.scale.width) clouds.x = -halfW
    }

    // ── API pública ────────────────────────────────────────

    /**
     * Pausa o reanuda tweens y el timer de la escena.
     *
     * GOTCHA: este método puede llamarse ANTES de que `create()` haya corrido
     * (el efecto de React se dispara antes de que Phaser termine el boot).
     * Por eso guarda el flag en la variable de closure y comprueba que
     * `this.tweens` / `this.time` existan antes de usarlos; el estado
     * acumulado se aplica al final de `create()`.
     */
    setPaused(p: boolean) {
      paused = p
      if (this.tweens) { p ? this.tweens.pauseAll() : this.tweens.resumeAll() }
      if (this.time)   { this.time.paused = p }
    }

    /** Delegación pública hacia `relayout`; llamado desde `BackgroundGame.resize()`. */
    updateLayout(w: number, h: number) { this.relayout(w, h) }
  }

  return new Scene() as unknown as IBackgroundScene
}
