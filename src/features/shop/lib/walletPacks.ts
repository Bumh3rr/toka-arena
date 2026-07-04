/**
 * Configuración estática de la Wallet (compra de TF con dinero real).
 *
 * No existe endpoint de paquetes ni webhook de Tokapay todavía, así que estos
 * datos viven aquí como fuente única. Cuando el backend exista, se reemplaza
 * este módulo por un hook SWR sin tocar los componentes de UI.
 */

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
  content: string
  sub: string
  mxn: number
}

export const WELCOME_BUNDLE: WelcomeBundle = {
  tag: 'OFERTA ÚNICA',
  title: 'Bienvenido a Toka Arena',
  content: '250 TF + 1 Huevo Raro + 1 Accesorio',
  sub: '42% de descuento — solo por hoy',
  mxn: 49,
}

export const TF_PACKS: TfPack[] = [
  { id: 'p1', name: 'Bolsita', tf: 50, bonus: 0, mxn: 29 },
  { id: 'p2', name: 'Moderado', tf: 275, bonus: 25, mxn: 99 },
  { id: 'p3', name: 'Grande', tf: 690, bonus: 90, mxn: 199 },
  { id: 'p4', name: 'Premium', tf: 1800, bonus: 300, mxn: 399, popular: true },
  { id: 'p5', name: 'Leyenda', tf: 5200, bonus: 1200, mxn: 899 },
]

export const SPECIAL_PACKS: SpecialPack[] = [
  { id: 'sp1', name: 'Evolution Support', desc: '500 TF + 1 Evolution Shield', mxn: 129, tone: 'legend' },
  { id: 'sp2', name: 'Weekly Booster', desc: '150 TF + 1 CP Booster', mxn: 49, tone: 'legend' },
  { id: 'sp3', name: 'Monthly Cosmetic', desc: 'Accesorio Legendario + 200 TF', mxn: 199, tone: 'purple' },
]
