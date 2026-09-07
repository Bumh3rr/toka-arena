/**
 * Configuración **visual** de la Wallet.
 *
 * Los precios, el TF y el bonus vienen del backend (`GET /store/tokafeed/packages`
 * y `GET /store/tokafeed/welcome-bundle`): duplicarlos aquí, con dinero real de
 * por medio, sería una forma de enseñar una cifra y cobrar otra. Lo que queda en
 * este módulo es solo lo que la API no sabe — ilustración, adorno y copy fijo.
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

/** Parte visual de un paquete: lo único que no viene del backend. */
export interface TfPackArtSpec {
  art: TfPackArt
  artSize: number
  flair: TfPackFlair
  popular?: boolean
}

/**
 * Arte por paquete, indexado por el `displayName` del backend.
 *
 * Si el backend añade un paquete que no está aquí, cae al default en vez de
 * romper la Wallet: la tienda no debe depender de que este mapa esté al día.
 */
export const TF_PACK_ART_SPEC: Record<string, TfPackArtSpec> = {
  Bolsita:  { art: 'bag',   artSize: 56, flair: 'plain' },
  Moderado: { art: 'stack', artSize: 64, flair: 'plain' },
  Grande:   { art: 'stack', artSize: 70, flair: 'spark' },
  Premium:  { art: 'bag',   artSize: 78, flair: 'halo', popular: true },
  Leyenda:  { art: 'box',   artSize: 82, flair: 'legend' },
}

/** Aspecto sobrio para un paquete que la UI todavía no conoce. */
export const DEFAULT_TF_PACK_ART_SPEC: TfPackArtSpec = {
  art: 'coin',
  artSize: 56,
  flair: 'plain',
}

/** Bundle especial con contenido mixto (TF + ítems). */
export interface SpecialPack {
  id: string
  name: string
  desc: string
  mxn: number
  tone: 'legend' | 'purple' | 'blue'
}

/** Copy fijo de la oferta de bienvenida. Precio y contenidos vienen de la API. */
export const WELCOME_BUNDLE_COPY = {
  tag: 'Oferta única',
  title: 'Bienvenido a Toka Arena',
  ribbon: 'Solo una vez por cuenta',
} as const

export const SPECIAL_PACKS: SpecialPack[] = [
  { id: 'sp1', name: 'Evolution Support', desc: '500 TF + 1 Evolution Shield', mxn: 129, tone: 'legend' },
  { id: 'sp2', name: 'Weekly Booster', desc: '150 TF + 1 CP Booster', mxn: 49, tone: 'legend' },
  { id: 'sp3', name: 'Monthly Cosmetic', desc: 'Huevo Epico + 200 TF', mxn: 199, tone: 'purple' },
]
