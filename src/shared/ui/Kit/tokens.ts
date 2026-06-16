// Sistema de colores compartido para todos los componentes de UIKit/
export type ColorVariant =
  | 'legend'   // naranja-dorado — CTA principal
  | 'gold'     // amarillo-dorado
  | 'warm'     // crema con tinte dorado (style swapPill)
  | 'green'    // verde acción
  | 'blue'     // azul acento
  | 'purple'   // morado acento
  | 'cream'    // neutro / secundario
  | 'danger'   // rojo

export interface ColorToken {
  bgFrom: string     // tope del gradiente
  bg: string         // base del gradiente / color sólido
  edge: string       // color del borde inferior 3D
  text: string       // color del texto
  shine: string      // highlight inset superior
  textShadow?: string
  // versión suave para Card y Label
  softBg?: string
  softText?: string
}

export const TOKENS: Record<ColorVariant, ColorToken> = {
  legend: {
    bgFrom:     '#FFD15A',
    bg:         'var(--legend)',
    edge:       'var(--legend-edge)',
    text:       '#fff',
    shine:      'rgba(255,255,255,.6)',
    textShadow: '0 1.5px 0 rgba(74,40,0,.3)',
    softBg:     '#FFF8E6',
    softText:   'var(--legend-edge)',
  },
  gold: {
    bgFrom:     '#FFE7A6',
    bg:         'var(--gold)',
    edge:       'var(--gold-edge)',
    text:       'var(--ink)',
    shine:      'rgba(255,255,255,.65)',
    softBg:     'var(--gold-soft)',
    softText:   'var(--gold-edge)',
  },
  warm: {
    bgFrom:     '#FFF7E6',
    bg:         '#FFE6BD',
    edge:       'var(--gold-edge)',
    text:       'var(--ink)',
    shine:      'rgba(255,255,255,.7)',
    softBg:     '#FFFBF0',
    softText:   'var(--ink-2)',
  },
  green: {
    bgFrom:     '#7FD15E',
    bg:         'var(--green)',
    edge:       'var(--green-edge)',
    text:       '#fff',
    shine:      'rgba(255,255,255,.5)',
    textShadow: '0 1px 0 rgba(74,40,0,.3)',
    softBg:     'var(--green-soft)',
    softText:   'var(--green-edge)',
  },
  blue: {
    bgFrom:     '#6EC6EE',
    bg:         'var(--blue)',
    edge:       'var(--blue-edge)',
    text:       '#fff',
    shine:      'rgba(255,255,255,.5)',
    textShadow: '0 1px 0 rgba(0,50,100,.25)',
    softBg:     'var(--blue-soft)',
    softText:   'var(--blue-edge)',
  },
  purple: {
    bgFrom:     '#B994E8',
    bg:         'var(--purple)',
    edge:       'var(--purple-edge)',
    text:       '#fff',
    shine:      'rgba(255,255,255,.45)',
    textShadow: '0 1px 0 rgba(50,0,80,.2)',
    softBg:     'var(--purple-soft)',
    softText:   'var(--purple-edge)',
  },
  cream: {
    bgFrom:     '#FFFBF1',
    bg:         'var(--cream)',
    edge:       'var(--edge-cream)',
    text:       'var(--ink)',
    shine:      'rgba(255,255,255,.9)',
    softBg:     'var(--cream-2)',
    softText:   'var(--ink-2)',
  },
  danger: {
    bgFrom:     '#F07070',
    bg:         '#E85454',
    edge:       '#C03030',
    text:       '#fff',
    shine:      'rgba(255,255,255,.4)',
    textShadow: '0 1px 0 rgba(80,0,0,.3)',
    softBg:     '#FDE8E8',
    softText:   '#C03030',
  },
}
