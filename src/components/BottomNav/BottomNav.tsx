import { useNavigate, useLocation } from 'react-router-dom'
import styles from './BottomNav.module.css'
import { IconButton } from '../UIKit'
import TokagotchiCanvas from '../Tokagotchi/TokagotchiCanvas'
import { IcGrid, IcPase, IcShop, IcArena } from '../Icons/Icons'

const LEFT_ITEMS = [
  { label: 'Tienda',    path: '/tienda',    icon: <IcShop /> },
  { label: 'Colección', path: '/coleccion', icon: <IcGrid /> },
]
const RIGHT_ITEMS = [
  { label: 'Arena', path: '/arena',  icon: <IcArena /> },
  { label: 'Pase',  path: '/ui-kit', icon: <IcPase /> },
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
  const navigate      = useNavigate()
  const { pathname }  = useLocation()
  const isHome        = pathname === '/home' || pathname === '/'

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      <div className={styles.container}>

        {LEFT_ITEMS.map(item => (
          <NavBtn key={item.path} item={item} active={pathname === item.path} />
        ))}

        {/* Reserva espacio para el botón flotante central */}
        <div className={styles.centerSlot} aria-hidden="true" />

        {/* Botón flotante — home */}
        <div className={`${styles.flotanteWrapper} ${isHome ? styles.flotanteActive : ''}`}>
          <IconButton
            onClick={() => navigate('/home')}
            variant={isHome ? 'legend' : 'warm'}
            size={70}
            shape="round"
            ariaLabel="Inicio"
          >
            <TokagotchiCanvas
              accesorioIndexCabeza={1}
              accesorioIndexCuerpo={1}
              animacionActual="idle"
              especie="TOFU"
              width={63}
              height={59}
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
