import { useNavigate } from 'react-router-dom'
import WoodButton from '../../components/WoodButton/WoodButton'
import TokagotchiCanvas from '../../components/TofuCanvas/TofuCanvas'
import { useLoginMusic } from '../../hooks/useLoginMusic'
import { useAuth } from '../../hooks/useAuth'
import { MOCHI_MOCK } from '../../constants/tokagotchis'
import styles from './LoginPage.module.css'

type LoginPageProps = {
  authCode: string | null
}

export default function LoginPage({ authCode }: LoginPageProps) {
  const navigate = useNavigate()
  const { stop } = useLoginMusic()
  const { loginWithToka, loading, error } = useAuth()
  
  const handleLogin = async () => {
    const { success, hasFirstToka } = await loginWithToka({ authCode })
    if (success) {
      stop()
      navigate(hasFirstToka ? '/home' : '/unboxing', { replace: true })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.logoContainer}>
        <img
          src="/assets/logo/logo.png"
          alt="Toka"
          className={styles.logoTitle}
        />
      </div>

      <div className={styles.buttonContainer}>
        <TokagotchiCanvas
          tokagotchi={MOCHI_MOCK}
          animacion="idle"
          width={320}
          height={320}
          scale={0.3}
        />

        {error && (
          <p style={{
            color: '#EF5350',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            textAlign: 'center',
            textShadow: '1px 1px 0px #3D2B1F',
            marginBottom: 8
          }}>
            {error}
          </p>
        )}

        <WoodButton
          label={loading ? 'Entrando...' : 'Entrar con mi cuenta Toka'}
          onClick={handleLogin}
          width="300px"
          disabled={loading}
        />
      </div>
    </div>
  )
}