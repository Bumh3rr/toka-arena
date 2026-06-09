import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './BottomNav.module.css'
import { IconButton, Button } from '../UIKit'
import TokagotchiCanvas from '../Canvas/TokagotchiCanvas'
import { IcGrid, IcPase, IcShop, IcArena } from '../Utils/Icons/Icons'
import { useNavBar } from '../../hooks/useNavBar'

const LEFT_ITEMS = [
  { label: 'Tienda', path: '/tienda', icon: <IcShop /> },
  { label: 'Colección', path: '/coleccion', icon: <IcGrid /> },
]
const RIGHT_ITEMS = [
  { label: 'Arena', path: '/arena', icon: <IcArena /> },
  { label: 'Pase', path: '/ui-kit', icon: <IcPase /> },
]

type NavItem = { label: string; path: string; icon: React.ReactNode }

function NavBtn({ item, active }: { item: NavItem; active: boolean }) {
  const navigate = useNavigate()
  return (
    <button
      className={`${styles.item} ${active ? styles.active : ''}`}
      onClick={() => navigate(item.path)}
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
    >
      <div className={styles.iconWrapper}>
        {active && <div className={styles.activePill} />}
        <span className={styles.icon}>{item.icon}</span>
      </div>
    </button>
  )
}

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { hidden } = useNavBar()
  const isHome = pathname === '/home' || pathname === '/'
  const navRef = useRef<HTMLElement>(null)

  // Publica --nav-height en :root para que AppLayout.main pueda usar el valor real.
  // ResizeObserver se adapta automáticamente a cambios de tamaño (safe-area, zoom, etc.)
  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const h = entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height
      document.documentElement.style.setProperty('--nav-height', `${h}px`)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      ref={navRef}
      className={`${styles.nav} ${hidden ? styles.navHidden : ''}`}
      aria-label="Navegación principal"
      aria-hidden={hidden}
    >
      <div className={styles.container}>

        {LEFT_ITEMS.map(item => (
          <NavBtn key={item.path} item={item} active={pathname === item.path} />
        ))}

        {/* Reserva espacio para el botón flotante central */}
        <div className={styles.centerSlot} aria-hidden="true" />

        {/* Botón flotante — home */}
        <div className={styles.flotanteWrapper}>
          <IconButton
            onClick={() => navigate('/home')}
            variant={isHome ? 'legend' : 'warm'}
            size={70}
            shape="round"
            ariaLabel="Inicio"
            className={styles.toka}
          >
            <TokagotchiCanvas
              accesorioIndexCabeza={1}
              accesorioIndexCuerpo={1}
              animacionActual="idle"
              especie="HANA"
              width={63}
              height={59}
              paused={isHome}
            />
          </IconButton>
        </div>

        {RIGHT_ITEMS.map(item => (
          <NavBtn key={item.path} item={item} active={pathname === item.path} />
        ))}

      </div>
    </nav>
  )
}
