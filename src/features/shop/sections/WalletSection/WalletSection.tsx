import { Toast } from '@/shared/ui/Kit'
import { useToast } from '@/shared/hooks/useToast'
import { TF_PACKS, SPECIAL_PACKS } from '../../lib/walletPacks'
import SectionDivider from '../../components/SectionDivider/SectionDivider'
import WelcomeBundleBanner from '../../components/wallet/WelcomeBundleBanner/WelcomeBundleBanner'
import TfPackCard from '../../components/wallet/TfPackCard/TfPackCard'
import SpecialPackCard from '../../components/wallet/SpecialPackCard/SpecialPackCard'
import styles from './WalletSection.module.css'

export default function WalletSection() {
  const { show, toast } = useToast()

  // Placeholder: aún no existe el flujo de pago con Toka Pay (sin backend).
  const notify = () => show('Pronto podrás cargar TF con Toka', { variant: 'info' })

  return (
    <>
      <WelcomeBundleBanner onClaim={notify} />

      <SectionDivider>Carga TF con Toka Pay</SectionDivider>
      <div className={styles.packs}>
        {TF_PACKS.map((p, i) => (
          <TfPackCard key={p.id} pack={p} index={i} onBuy={notify} />
        ))}
      </div>

      <SectionDivider>Packs especiales</SectionDivider>
      <div className={styles.hscroll}>
        {SPECIAL_PACKS.map((p) => (
          <SpecialPackCard key={p.id} pack={p} onBuy={notify} />
        ))}
      </div>

      {toast && <Toast {...toast} />}
    </>
  )
}
