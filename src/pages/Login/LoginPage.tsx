import { useNavigate } from 'react-router-dom'
import WoodButton from '../../components/WoodButton/WoodButton'
import TokagotchiCanvas from '../../components/Tokagotchi/TokagotchiCanvas'
import { useLoginMusic } from '../../hooks/useLoginMusic'
import { useAuth } from '../../hooks/useAuth'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { stop } = useLoginMusic()
  const { loginWithToka, loading, error } = useAuth()

  const handleLogin = async () => {
    const { success, hasFirstToka } = await loginWithToka()
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
          accesorioIndexCabeza={1}
          accesorioIndexCuerpo={1}
          animacionActual={'idle'}
          tokaActual={'tofu'}
          reverse={false} />

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