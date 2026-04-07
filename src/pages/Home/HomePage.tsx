import { authService } from '../../services/authService'
import styles from './HomePage.module.css'

export default function HomePage() {

  const handleLogout = () => {
    authService.clearSession()
    window.location.href = '/login'
  }

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <h1 className={styles.title}>¡Bienvenido a<br />Toka Arena!</h1>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  )
}