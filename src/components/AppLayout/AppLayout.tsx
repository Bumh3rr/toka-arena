import { Outlet } from 'react-router-dom'
import BottomNav from '../../pages/BottomNav/BottomNav'
import styles from './AppLayout.module.css'

export default function AppLayout() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}