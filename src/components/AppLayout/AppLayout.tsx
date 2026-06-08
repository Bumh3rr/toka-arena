import { Outlet } from 'react-router-dom'
import BottomNav from '../BottomNav/BottomNav'
import { useAppMusic } from '../../hooks/music/useAppMusic'
import { NavBarProvider, useNavBar } from '../../hooks/useNavBar'
import styles from './AppLayout.module.css'

/**
 * Root del layout autenticado.
 * El NavBarProvider envuelve todo para que cualquier página hija
 * pueda llamar useNavBar() y ocultar/mostrar el nav con transición.
 */
export default function AppLayout() {
  useAppMusic()
  return (
    <NavBarProvider>
      <AppLayoutInner />
    </NavBarProvider>
  )
}

function AppLayoutInner() {
  const { hidden } = useNavBar()
  return (
    <div className={styles.wrapper}>
      <main className={`${styles.main} ${hidden ? styles.mainFull : ''}`}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
