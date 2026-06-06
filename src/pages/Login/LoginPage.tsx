import { useNavigate } from 'react-router-dom'
import WoodButton from '../../components/WoodButton/WoodButton'
import TokagotchiCanvas from '../../components/Tokagotchi/TokagotchiCanvas'
import { useAuth } from '../../hooks/useAuth'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginWithToka, loading, error } = useAuth()

  const handleLogin = async () => {
    const { success, hasFirstToka } = await loginWithToka()
    if (success) {
      navigate(hasFirstToka ? '/home' : '/unboxing', { replace: true })
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
          {/* Tokagotchi */}
          <TokagotchiCanvas
            accesorioIndexCabeza={0}
            accesorioIndexCuerpo={1}
            animacionActual={'idle'}
            especie='HANA'
            reverse={false} />
        </div>

        {/* Botton */}
        <WoodButton
          label={loading ? 'Entrando...' : 'Entrar con mi cuenta Toka'}
          onClick={handleLogin}
          width="300px"
          disabled={loading}
        />
        
        {/* Mensaje de error */}
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

    </div>
  )
}