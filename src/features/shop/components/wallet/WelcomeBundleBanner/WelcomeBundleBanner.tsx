import { Suspense, lazy } from 'react'
import { Button, Label } from '@/shared/ui/Kit'
import { WELCOME_BUNDLE_COPY } from '@/features/shop/lib/walletPacks'
import type { WelcomeBundleOfferDTO } from '@/features/shop/api/dto/tokafeed.dto'
import styles from './WelcomeBundleBanner.module.css'

/**
 * Rive entra en diferido a propósito: el runtime más el WASM pesan cerca de
 * 2 MB y no deben estar en el bundle inicial de la app. Solo se descargan
 * cuando el jugador abre la pestaña Wallet.
 */
const RiveAnimation = lazy(() => import('@/shared/ui/Rive/RiveAnimation'))

interface WelcomeBundleBannerProps {
  offer: WelcomeBundleOfferDTO
  onClaim: () => void
  /** Hay otra compra en curso: no se puede iniciar esta. */
  disabled?: boolean
}

/** Animación de Rive que ocupa el escenario completo de la oferta. */
const HERO_RIV = '/assets/animations/proffer/proffer_welcome.riv'
/**
 * La ilustración estática hace de póster: se ve mientras el WASM carga, y se
 * queda si el webview no lo permite. Nunca hay hueco vacío.
 */
const HERO_POSTER = '/assets/animations/proffer/proffer_welcome.png'

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
export default function WelcomeBundleBanner({ offer, onClaim, disabled = false }: WelcomeBundleBannerProps) {
  const mxn = offer.priceMxnCents / 100
  const originalMxn = offer.originalValueMxnCents / 100
  const discount = Math.round((1 - mxn / originalMxn) * 100)

  return (
    <section className={styles.offer} aria-label={WELCOME_BUNDLE_COPY.title}>
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
            <Label size="xs" variant="cream" look="solid">{WELCOME_BUNDLE_COPY.tag}</Label>
            <span className={styles.discount}>-{discount}%</span>
          </div>

          {/* El pie oscurece la base de la escena para que el texto se lea */}
          <div className={styles.caption}>
            <h3 className={styles.title}>{WELCOME_BUNDLE_COPY.title}</h3>
            <p className={styles.items}>{offer.description}</p>
          </div>
        </div>

        {/* Barra de precio, separada del arte como en la referencia */}
        <div className={styles.priceBar}>
          <div className={styles.prices}>
            <span className={styles.price}>${mxn} MXN</span>
            <s className={styles.was}>${originalMxn}</s>
          </div>
          <Button variant="legend" size="md" radius="lg" disabled={disabled} onClick={onClaim}>
            Reclamar
          </Button>
        </div>
      </div>

      <div className={styles.ribbon}>{WELCOME_BUNDLE_COPY.ribbon}</div>
    </section>
  )
}
