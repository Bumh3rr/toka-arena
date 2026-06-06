import { Outlet } from 'react-router-dom'
import BottomNav from '../../pages/BottomNav/BottomNav'
import { useAppMusic } from '../../hooks/music/useAppMusic'
import styles from './AppLayout.module.css'

export default function AppLayout() {
  useAppMusic() // Este hook se encarga de la música de fondo según la ruta
  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}