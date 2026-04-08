import WoodButton from '../../components/WoodButton/WoodButton'
import TokagotchiCanvas from '../../components/TofuCanvas/TofuCanvas'
import { useLoginMusic } from '../../hooks/useLoginMusic'
import styles from './LoginPage.module.css'
import { MOCHI_MOCK } from '../../constants/tokagotchis'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { stop } = useLoginMusic()
  const navigate = useNavigate()
  const { login } = useAuth()

    const handleLogin = async () => {
    const success = await login({
      username: 'eduardo',
      password: '123456'
    })

    if (success) {
      stop()
      navigate('/unboxing')
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
        <WoodButton
          label="Entrar con mi cuenta Toka"
          onClick={handleLogin}
          width="300px"
        />
      </div>
    </div>
  )
}