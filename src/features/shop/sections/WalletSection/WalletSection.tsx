import { Toast } from '@/shared/ui/Kit'
import Loading from '@/shared/ui/Loading/Loading'
import PageError from '@/shared/ui/Error/Error'
import { useToast } from '@/shared/hooks/useToast'
import { getApiErrorMessage } from '@/shared/api/client'
import { SPECIAL_PACKS } from '../../lib/walletPacks'
import { useTfPackages } from '../../hooks/useTfPackages'
import { useWelcomeBundle } from '../../hooks/useWelcomeBundle'
import { useWalletPayment } from '../../hooks/useWalletPayment'
import SectionDivider from '../../components/SectionDivider/SectionDivider'
import WelcomeBundleBanner from '../../components/wallet/WelcomeBundleBanner/WelcomeBundleBanner'
import TfPackCard from '../../components/wallet/TfPackCard/TfPackCard'
import SpecialPackCard from '../../components/wallet/SpecialPackCard/SpecialPackCard'
import PayConfirmSheet from '../../components/wallet/PayConfirmSheet/PayConfirmSheet'
import PayStatusSheet from '../../components/wallet/PayStatusSheet/PayStatusSheet'
import styles from './WalletSection.module.css'

export default function WalletSection() {
  const { show, toast } = useToast()
  const { packs, isLoading, error, reload } = useTfPackages()
  const { offer } = useWelcomeBundle()
  const payment = useWalletPayment()

  /** Un solo pago a la vez: mientras haya uno abierto, no se empieza otro. */
  const busy = payment.step !== 'idle'

  // Los packs especiales no tienen catálogo en el backend todavía.
  const notifySpecial = () => show('Pronto podrás comprar packs especiales', { variant: 'info' })

  if (isLoading) return <Loading text="Cargando paquetes..." compact />
  if (error) {
    return (
      <PageError
        message={getApiErrorMessage(error, 'No pudimos cargar los paquetes')}
        onRetry={reload}
      />
    )
  }

  return (
    <>
      {offer?.available && (
        <WelcomeBundleBanner
          offer={offer}
          disabled={busy}
          onClaim={() => payment.chooseBundle(offer)}
        />
      )}

      <SectionDivider>Carga TF con Toka Pay</SectionDivider>
      <div className={styles.packs}>
        {packs.map((pack, i) => (
          <TfPackCard
            key={pack.id}
            pack={pack}
            index={i}
            onBuy={() => !busy && payment.choosePack(pack)}
          />
        ))}
      </div>

      <SectionDivider>Packs especiales</SectionDivider>
      <div className={styles.hscroll}>
        {SPECIAL_PACKS.map((p) => (
          <SpecialPackCard key={p.id} pack={p} onBuy={notifySpecial} />
        ))}
      </div>

      {/*
        La hoja de confirmación sigue abierta durante `paying`, con el botón en
        "Abriendo pago...": si se cerrara al confirmar, la pantalla se quedaría
        muda mientras se crea la orden.
      */}
      {payment.purchase && (payment.step === 'confirm' || payment.step === 'paying') && (
        <PayConfirmSheet
          name={payment.purchase.name}
          tf={payment.purchase.tf}
          bonus={payment.purchase.bonus}
          mxn={payment.purchase.mxn}
          extras={payment.purchase.extras}
          busy={payment.step === 'paying'}
          onConfirm={payment.pay}
          onClose={payment.close}
        />
      )}

      <PayStatusSheet
        step={payment.step}
        tf={payment.purchase?.tf ?? 0}
        error={payment.error}
        onRetry={payment.pay}
        onCheck={payment.check}
        onClose={payment.close}
      />

      {toast && <Toast {...toast} />}
    </>
  )
}
