import { useNavigate } from 'react-router-dom'
import WoodButton from '@/shared/ui/WoodButton/WoodButton'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import { useAuth } from '@/shared/player/hooks/useAuth'
import styles from './LoginPage.module.css'
import { Toast } from '@/shared/ui/Kit'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error, toast } = useAuth()

  const handleLogin = async () => {
    const { success, isNewPlayer } = await login()
    if (success) {
      navigate(isNewPlayer ? '/unboxing' : '/home', { replace: true })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      {/* Logo */}
      <div className={styles.logoContainer}>
        <img
          src="/assets/logo/logo.png"
          alt="Toka"
          className={styles.logoTitle}
        />
      </div>

      {/* Tokagotchi & Boton de login */}
      <div className={styles.buttonContainer}>

        {/* Animacion de Tokagotchi */}
        <div className={styles.tokagotchiContainer}>
          <TokagotchiCanvas
            animacionActual={'idle'}
            species='HANA'
            reverse={false} />
        </div>

        {/* Botton */}
        <WoodButton
          label={loading ? 'Entrando...' : 'Entrar con mi cuenta Toka'}
          onClick={handleLogin}
          width="300px"
          disabled={loading}
        />

        {/* Toast de mensajes */}
        {toast && <Toast {...toast} />}

        {/* Mensaje de error */}
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

    </div>
  )
}