import { Toast } from '@/shared/ui/Kit'
import Loading from '@/shared/ui/Loading/Loading'
import PageError from '@/shared/ui/Error/Error'
import { useToast } from '@/shared/hooks/useToast'
import { getApiErrorMessage } from '@/shared/api/client'
import { SPECIAL_PACKS } from '../../lib/walletPacks'
import { useTfPackages } from '../../hooks/useTfPackages'
import { useWelcomeBundle } from '../../hooks/useWelcomeBundle'
import { useTokaPayPurchase } from '../../hooks/useTokaPayPurchase'
import SectionDivider from '../../components/SectionDivider/SectionDivider'
import WelcomeBundleBanner from '../../components/wallet/WelcomeBundleBanner/WelcomeBundleBanner'
import TfPackCard from '../../components/wallet/TfPackCard/TfPackCard'
import SpecialPackCard from '../../components/wallet/SpecialPackCard/SpecialPackCard'
import PayConfirmSheet from '../../components/wallet/PayConfirmSheet/PayConfirmSheet'
import PayStatusSheet from '../../components/wallet/PayStatusSheet/PayStatusSheet'
import styles from './WalletSection.module.css'

export default function WalletSection() {
  const { show, toast: sectionToast } = useToast()
  const { packs, isLoading, error, reload } = useTfPackages()
  const { offer } = useWelcomeBundle()
  const { phase, busy, start, confirm, retry, refresh, close, toast: payToast } = useTokaPayPurchase()

  // Los packs especiales no tienen catálogo en el backend todavía.
  const notifySpecial = () => show('Pronto podrás comprar packs especiales', { variant: 'info' })

  // La confirmación cubre dos fases: elegir (`confirm`) y esperar a que la orden
  // se cree (`creating`), que es cuando el botón pasa a "Abriendo pago...".
  const confirming =
    phase.status === 'confirm' || phase.status === 'creating'
      ? { target: phase.target, busy: phase.status === 'creating' }
      : null

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
          onClaim={() => start({ kind: 'welcomeBundle', offer })}
        />
      )}

      <SectionDivider>Carga TF con Toka Pay</SectionDivider>
      <div className={styles.packs}>
        {packs.map((pack, i) => (
          <TfPackCard
            key={pack.id}
            pack={pack}
            index={i}
            onBuy={() => !busy && start({ kind: 'package', pack })}
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
        El sheet sigue montado durante `creating` (con `busy`): si se desmontara
        al confirmar, la pantalla se quedaría muda hasta que abra la caja de pago.
      */}
      {confirming && confirming.target.kind === 'package' && (
        <PayConfirmSheet
          name={confirming.target.pack.name}
          tf={confirming.target.pack.tf}
          bonus={confirming.target.pack.bonus}
          mxn={confirming.target.pack.mxn}
          busy={confirming.busy}
          onConfirm={confirm}
          onClose={close}
        />
      )}

      {confirming && confirming.target.kind === 'welcomeBundle' && (
        <PayConfirmSheet
          name="Bienvenido a Toka Arena"
          tf={confirming.target.offer.tfAmount}
          bonus={0}
          mxn={confirming.target.offer.priceMxnCents / 100}
          extras={confirming.target.offer.description}
          busy={confirming.busy}
          onConfirm={confirm}
          onClose={close}
        />
      )}

      <PayStatusSheet phase={phase} onRetry={retry} onRefresh={refresh} onClose={close} />

      {payToast && <Toast {...payToast} />}
      {sectionToast && <Toast {...sectionToast} />}
    </>
  )
}
