import { Outlet } from 'react-router-dom'
import BottomNav from '../BottomNav/BottomNav'
import { useAppMusic } from '../../../shared/hooks/music/useAppMusic'
import { NavBarProvider, useNavBar } from '../../../shared/hooks/useNavBar'
import { ArenaSocketProvider } from '../../../shared/ws/ArenaSocketProvider'
import styles from './AppLayout.module.css'

/**
 * Root del layout autenticado.
 *
 * El NavBarProvider envuelve todo para que cualquier página hija pueda llamar
 * useNavBar() y ocultar/mostrar el nav con transición.
 *
 * El ArenaSocketProvider vive aquí, y no en la página de arena, porque el
 * emparejamiento se anuncia cuando el servidor lo decide: un match encontrado
 * mientras el jugador está en Home tiene que llegar igual.
 */
export default function AppLayout() {
  useAppMusic()
  return (
    <ArenaSocketProvider>
      <NavBarProvider>
        <AppLayoutInner />
      </NavBarProvider>
    </ArenaSocketProvider>
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
