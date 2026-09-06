/**
 * Configuración estática de la Wallet (compra de TF con dinero real).
 *
 * No existe endpoint de paquetes ni webhook de Tokapay todavía, así que estos
 * datos viven aquí como fuente única. Cuando el backend exista, se reemplaza
 * este módulo por un hook SWR sin tocar los componentes de UI.
 */

/**
 * Ilustración que representa al paquete.
 *
 * Se declara por paquete en vez de deducirse de la cantidad de TF: así el
 * dibujo concuerda con el nombre ("Bolsita" enseña una bolsa) y añadir un
 * paquete no obliga a tocar el componente.
 */
export type TfPackArt = 'coin' | 'stack' | 'bag' | 'box'

/** Rutas de las ilustraciones de la Wallet. */
export const TF_PACK_ART: Record<TfPackArt, string> = {
  coin: '/assets/ui/tf/tf.svg',
  stack: '/assets/ui/tf/stack_tf.svg',
  bag: '/assets/ui/tf/bg_tf.svg',
  box: '/assets/ui/tf/box_tf.svg',
}

/**
 * Nivel de adorno de la tarjeta.
 *
 * Sube con el paquete: los tiers bajos van sobrios y los altos acumulan
 * halo, destellos y rayos. Así la decoración informa del valor en vez de
 * repartirse por igual y aplanar la jerarquía.
 */
export type TfPackFlair = 'plain' | 'spark' | 'halo' | 'legend'

/** Paquete de TF comprable con pesos mexicanos (MXN). */
export interface TfPack {
  id: string
  name: string
  /** TF total acreditado (base + bonus). */
  tf: number
  /** TF extra de bonus (0 si no aplica). */
  bonus: number
  /** Precio en pesos mexicanos. */
  mxn: number
  /** Ilustración del medallón. */
  art: TfPackArt
  /**
   * Lado de la ilustración en px.
   *
   * Crece con el paquete: es la señal de nivel. Se apoya en el dibujo en vez
   * de en un adorno detrás porque el arte lo tapaba y no se veía. De paso
   * distingue a Bolsita de Premium, que comparten la misma bolsa.
   */
  artSize: number
  /** Cuánto adorno lleva la tarjeta. */
  flair: TfPackFlair
  /** Destacado como "más popular". */
  popular?: boolean
}

/** Bundle especial con contenido mixto (TF + ítems). */
export interface SpecialPack {
  id: string
  name: string
  desc: string
  mxn: number
  tone: 'legend' | 'purple' | 'blue'
}

/** Oferta de bienvenida, única por cuenta. */
export interface WelcomeBundle {
  tag: string
  title: string
  /**
   * Lo que trae, pieza por pieza. La ilustración ya enseña QUÉ entra
   * (moneda, corona, huevo); esta lista aporta las cantidades y se compone
   * como una frase, no como una tira de chips que repita el dibujo.
   */
  items: string[]
  /** Texto del listón inferior. */
  ribbon: string
  mxn: number
  /** Precio sin descuento, para el tachado. */
  originalMxn: number
}

export const WELCOME_BUNDLE: WelcomeBundle = {
  tag: 'Oferta única',
  title: 'Bienvenido a Toka Arena',
  items: ['250 TF', 'un huevo raro', 'un accesorio'],
  ribbon: 'Solo una vez por cuenta',
  mxn: 49,
  originalMxn: 85,
}

export const TF_PACKS: TfPack[] = [
  { id: 'p1', name: 'Bolsita',  tf: 50,   bonus: 0,    mxn: 29,  art: 'bag',   artSize: 56, flair: 'plain'  },
  { id: 'p2', name: 'Moderado', tf: 275,  bonus: 25,   mxn: 99,  art: 'stack', artSize: 64, flair: 'plain'  },
  { id: 'p3', name: 'Grande',   tf: 690,  bonus: 90,   mxn: 199, art: 'stack', artSize: 70, flair: 'spark'  },
  { id: 'p4', name: 'Premium',  tf: 1800, bonus: 300,  mxn: 399, art: 'bag',   artSize: 78, flair: 'halo',   popular: true },
  { id: 'p5', name: 'Leyenda',  tf: 5200, bonus: 1200, mxn: 899, art: 'box',   artSize: 82, flair: 'legend' },
]

export const SPECIAL_PACKS: SpecialPack[] = [
  { id: 'sp1', name: 'Evolution Support', desc: '500 TF + 1 Evolution Shield', mxn: 129, tone: 'legend' },
  { id: 'sp2', name: 'Weekly Booster', desc: '150 TF + 1 CP Booster', mxn: 49, tone: 'legend' },
  { id: 'sp3', name: 'Monthly Cosmetic', desc: 'Huevo Epico + 200 TF', mxn: 199, tone: 'purple' },
]
