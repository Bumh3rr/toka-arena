import { Suspense, lazy } from 'react'
import { Button, Label } from '@/shared/ui/Kit'
import { WELCOME_BUNDLE } from '@/features/shop/lib/walletPacks'
import styles from './WelcomeBundleBanner.module.css'

/**
 * Rive entra en diferido a propósito: el runtime más el WASM pesan cerca de
 * 2 MB y no deben estar en el bundle inicial de la app. Solo se descargan
 * cuando el jugador abre la pestaña Wallet.
 */
const RiveAnimation = lazy(() => import('@/shared/ui/Rive/RiveAnimation'))

interface WelcomeBundleBannerProps {
  onClaim: () => void
}

/** Animación de Rive que ocupa el escenario completo de la oferta. */
const HERO_RIV = '/assets/animations/proffer/proffer_welcome.riv'
/**
 * La ilustración estática hace de póster: se ve mientras el WASM carga, y se
 * queda si el webview no lo permite. Nunca hay hueco vacío.
 */
const HERO_POSTER = '/assets/animations/proffer/proffer_welcome.png'

/** Compone la lista de contenidos como frase: "a, b y c". */
function joinItems(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`
}

/**
 * Oferta de bienvenida.
 *
 * La ilustración no acompaña al texto: es la oferta. Ocupa el escenario
 * entero y el resto de la interfaz solo la enmarca — marco, barra de precio
 * y listón. El resplandor, los rayos y la viñeta van en CSS y no horneados
 * en el arte, así que se pueden ajustar sin volver a pedirlo.
 *
 * El escenario es una animación de Rive, con la ilustración estática de
 * respaldo mientras carga o si el webview bloquea el WASM.
 */
export default function WelcomeBundleBanner({ onClaim }: WelcomeBundleBannerProps) {
  const b = WELCOME_BUNDLE
  const discount = Math.round((1 - b.mxn / b.originalMxn) * 100)

  return (
    <section className={styles.offer} aria-label={b.title}>
      <div className={styles.frame}>
        {/* Escenario: fondo generado + ilustración */}
        <div className={styles.stage}>
          <div className={styles.rays} aria-hidden="true" />
          <div className={styles.vignette} aria-hidden="true" />

          <Suspense
            fallback={
              <img src={HERO_POSTER} alt="" aria-hidden="true" className={styles.hero} />
            }
          >
            <RiveAnimation src={HERO_RIV} poster={HERO_POSTER} className={styles.hero} />
          </Suspense>

          <div className={styles.badges}>
            <Label size="xs" variant="cream" look="solid">{b.tag}</Label>
            <span className={styles.discount}>-{discount}%</span>
          </div>

          {/* El pie oscurece la base de la escena para que el texto se lea */}
          <div className={styles.caption}>
            <h3 className={styles.title}>{b.title}</h3>
            <p className={styles.items}>{joinItems(b.items)}</p>
          </div>
        </div>

        {/* Barra de precio, separada del arte como en la referencia */}
        <div className={styles.priceBar}>
          <div className={styles.prices}>
            <span className={styles.price}>${b.mxn} MXN</span>
            <s className={styles.was}>${b.originalMxn}</s>
          </div>
          <Button variant="legend" size="md" radius="lg" onClick={onClaim}>
            Reclamar
          </Button>
        </div>
      </div>

      <div className={styles.ribbon}>{b.ribbon}</div>
    </section>
  )
}
