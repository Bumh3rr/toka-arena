/* ============================================================
   Toka Arena — Escena de fondo (paisaje estático + día/noche)
   El Home es una escena FIJA: las capas del paisaje NO hacen scroll
   (eso causaba la repetición y el deslizamiento). El movimiento
   ambiental viene de la nube que cruza + las luciérnagas de noche.
   ============================================================ */

export interface IBackgroundScene {
  setPaused(paused: boolean): void
  updateLayout(width: number, height: number): void
}

export interface BackgroundConfig {
  /** DEV: fuerza una hora (0-23) para previsualizar día/noche sin esperar al reloj */
  hourOverride?: number
}

type Phase = 'amanecer' | 'dia' | 'atardecer' | 'noche'

interface LayerObj {
  obj: any
  type: 'image' | 'rect'
  baseColor: number
  offsetY: number   // nudge vertical (px): negativo sube la capa, positivo la baja
}

export function createBackgroundScene(cfg: BackgroundConfig = {}): IBackgroundScene {
  const Phaser = (window as any).Phaser
  const Color = Phaser.Display.Color

  // --- Paletas por fase (AJUSTA estos hex a tu arte) ---
  const PALETTES: Record<Phase, { top: number; bot: number; tint: number; sun: number; moon: number; stars: number }> = {
    amanecer:  { top: 0xFAC79A, bot: 0xFFE9C7, tint: 0xFFE3C8, sun: 1,   moon: 0,   stars: 0    },
    dia:       { top: 0xBFE3FF, bot: 0xEAF6FF, tint: 0xFFFFFF, sun: 1,   moon: 0,   stars: 0    },
    atardecer: { top: 0xF59B5E, bot: 0xFFD2A2, tint: 0xF3C39A, sun: 0.5, moon: 0.4, stars: 0.25 },
    noche:     { top: 0x18233F, bot: 0x33405E, tint: 0x5E6B95, sun: 0,   moon: 1,   stars: 1    },
  }

  // --- Capas del paisaje (fondo -> frente). path = imagen real; color = placeholder ---
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
  const missing = new Set<string>()

  const mul = (base: number, tint: number): number => {
    const a = Color.ValueToColor(base), b = Color.ValueToColor(tint)
    return Color.GetColor((a.red * b.red) / 255, (a.green * b.green) / 255, (a.blue * b.blue) / 255)
  }
  const lerpC = (from: number, to: number, t: number): number => {
    const c = Color.Interpolate.ColorWithColor(Color.ValueToColor(from), Color.ValueToColor(to), 100, t * 100)
    return Color.GetColor(c.r, c.g, c.b)
  }
  const phaseForHour = (h: number): Phase =>
    (h >= 5 && h < 8) ? 'amanecer' :
    (h >= 8 && h < 18) ? 'dia' :
    (h >= 18 && h < 21) ? 'atardecer' : 'noche'
  const currentPhase = (): Phase => phaseForHour(cfg.hourOverride ?? new Date().getHours())

  class Scene extends Phaser.Scene {
    constructor() { super({ key: 'BackgroundScene' }) }

    preload() {
      this.load.on('loaderror', (file: any) => missing.add(file.key))
      LAYER_DEFS.forEach((l) => this.load.image(l.key, l.path))
      this.load.image('bg_clouds', '/assets/scene/clouds.png')
      this.load.image('bg_sun', '/assets/scene/sun.png')
      this.load.image('bg_moon', '/assets/scene/moon.png')
      this.load.image('bg_stars', '/assets/scene/stars.png')
    }

    create() {
      const W = this.scale.width, H = this.scale.height
      const has = (k: string) => this.textures.exists(k) && !missing.has(k)


      // cielo (gradiente, se redibuja al cambiar de fase)
      sky = this.add.graphics().setDepth(0)

      // estrellas y astros (dentro del cielo, detras de las colinas)
      if (has('bg_stars')) {
        const STAR_COUNT = 30
        for (let i = 0; i < STAR_COUNT; i++) {
          const s = this.add.image(
            Phaser.Math.Between(0, W),
            Phaser.Math.Between(0, Math.round(H * 0.55)),   // solo en el cielo
            'bg_stars',
          ).setDepth(0.3).setAlpha(0)
          const sizePx = Phaser.Math.FloatBetween(18, 28)    // tamaño en px (ajusta el rango a tu PNG)
          s.setScale(sizePx / s.width)                      // escala según el tamaño real de tu imagen
          s.setAngle(Phaser.Math.Between(0, 360))           // rotación al azar para que no se vean clonadas
          s.setData('maxAlpha', Phaser.Math.FloatBetween(0.5, 1))  // brillo distinto en cada una
          stars.push(s)
        }
      }

      sun  = has('bg_sun')  ? this.add.image(W * 0.78, H * 0.22, 'bg_sun').setDepth(0.4)  : this.add.circle(W * 0.78, H * 0.22, 26, 0xFFD25A).setDepth(0.4)
      moon = has('bg_moon') ? this.add.image(W * 0.22, H * 0.20, 'bg_moon').setDepth(0.4) : this.add.circle(W * 0.22, H * 0.20, 22, 0xEAF0FF).setDepth(0.4)

      // nube: UNA imagen que cruza lento (no mosaico). Si no hay asset, no se dibuja.
      clouds = has('bg_clouds') ? this.add.image(W * 0.3, H * 0.16, 'bg_clouds').setDepth(0.6) : null

      // capas del paisaje: IMAGEN estatica anclada al fondo (sin tile, sin scroll).
      // Si no hay asset -> banda de color como placeholder.
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

      // luciernagas (aparecen de noche)
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

      this.applyPhase(currentPhase(), true)
      this.time.addEvent({ delay: 60000, loop: true, callback: () => this.applyPhase(currentPhase(), false) })
      this.scale.on('resize', (gs: any) => this.relayout(gs.width, gs.height))

      // respeta un paused que haya llegado antes del boot
      if (paused) { this.tweens.pauseAll(); this.time.paused = true }

      // TODO: parallax sutil por giroscopio (offset pequeno, NO scroll continuo)
      // TODO: arboles que se mecen -> animarlo en el arte de cada capa, no moviendo la capa entera
      // TODO: hojas/petalos de dia (ademas de las luciernagas de noche)
    }

    drawSky(top: number, bot: number) {
      const W = this.scale.width, H = this.scale.height
      sky.clear()
      sky.fillGradientStyle(top, top, bot, bot, 1)
      sky.fillRect(0, 0, W, H)
    }

    applyPhase(phase: Phase, instant: boolean) {
      const p = PALETTES[phase]
      const fromTop = PALETTES[curPhase ?? phase].top
      const fromBot = PALETTES[curPhase ?? phase].bot
      const fromTint = PALETTES[curPhase ?? phase].tint
      curPhase = phase
      const dur = instant ? 0 : 1500

      const render = (t: number) => {
        this.drawSky(lerpC(fromTop, p.top, t), lerpC(fromBot, p.bot, t))
        const tint = lerpC(fromTint, p.tint, t)
        layers.forEach((L) => L.type === 'rect' ? L.obj.setFillStyle(mul(L.baseColor, tint)) : L.obj.setTint(tint))
        if (clouds && clouds.setTint) clouds.setTint(tint)
      }

      if (instant) {
        render(1)
      } else {
        const drv = { t: 0 }
        this.tweens.add({ targets: drv, t: 1, duration: dur, ease: 'Sine.inOut', onUpdate: () => render(drv.t) })
      }
      this.tweens.add({ targets: sun, alpha: p.sun, duration: dur || 1 })
      this.tweens.add({ targets: moon, alpha: p.moon, duration: dur || 1 })
      stars.forEach((s) => this.tweens.add({ targets: s, alpha: p.stars * s.getData('maxAlpha'), duration: dur || 1 }))
      fireflies.forEach((f) => this.tweens.add({ targets: f, alpha: p.stars, duration: dur || 1 }))
    }

    relayout(W: number, H: number) {
      if (curPhase) this.drawSky(PALETTES[curPhase].top, PALETTES[curPhase].bot)
      layers.forEach((L) => {
        if (L.type === 'image') { L.obj.setScale(W / L.obj.width); L.obj.x = W / 2; L.obj.y = H + L.offsetY }
      })
    }

    update(_t: number, delta: number) {
      if (paused || !clouds) return
      // unico movimiento: la nube cruza lento y reaparece por el otro lado
      const k = delta / 16.67
      clouds.x += 0.15 * k
      const halfW = clouds.displayWidth / 2
      if (clouds.x - halfW > this.scale.width) clouds.x = -halfW
    }

    // --- API publica ---
    setPaused(p: boolean) {
      paused = p
      if (this.tweens) { p ? this.tweens.pauseAll() : this.tweens.resumeAll() }
      if (this.time)   { this.time.paused = p }
    }
    updateLayout(w: number, h: number) { this.relayout(w, h) }
  }

  return new Scene() as unknown as IBackgroundScene
}