import { useNavigate, useLocation } from 'react-router-dom'
import styles from './BottomNav.module.css'
import { IconButton } from '../UIKit'
import TokagotchiCanvas from '../Tokagotchi/TokagotchiCanvas'
import { IcGrid, IcPase, IcShop } from '../Icons/Icons'

const RIGHT_ITEMS = [
  {
    label: 'Arena',
    path: '/arena',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <g fill="none" stroke="#8C6B4A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M2 19.2L3.8 21m.9-7.2l.9 3.6m0 0l3.6.9m-3.6-.9l-2.7 2.7M16.4 3.9l-9 9l.45 2.25l2.25.45l9-9L20 3z" />
          <path d="M22 19.2L20.2 21m-.9-7.2l-.9 3.6m0 0l2.7 2.7m-2.7-2.7l-1.8.45l-1.8.45M9.3 11L4.9 6.6L4 3l3.6.9L12 8.3m.1 5.5l1.8 1.8l2.25-.45l.45-2.25l-1.8-1.8" />
        </g>
      </svg>
  },
  {
    label: 'Pase',
    path: '/ui-kit',
    icon: <IcPase />
  }
]

const LEFT_ITEMS = [
  {
    label: 'Tienda',
    path: '/tienda',
    icon: <IcShop />
  },
  {
    label: 'Colección',
    path: '/coleccion',
    icon: <IcGrid />
  }
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Items izquierda */}
        {LEFT_ITEMS.map((item) => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              className={`${styles.item} ${active ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className={styles.iconWrapper}>
                {active && <div className={styles.activePill} />}
                <div className={styles.icon}>{item.icon}</div>
              </div>
            </button>
          )
        })}

        {/* Espacio invisible donde flota el botón flotante */}
        <div className={styles.flotantePlaceholder} />

        {/* Botón flotante */}
        <div
          className={`${styles.flotanteWrapper}`}
          onClick={() => navigate('/home')}
        >
          <IconButton variant={'legend'} size={70} shape="round" ariaLabel={"Button Flotante"}>
            <TokagotchiCanvas
              accesorioIndexCabeza={1}
              accesorioIndexCuerpo={1}
              animacionActual={'idle'}
              especie='HANA'
              width={65}
              height={53}
            />
          </IconButton>
        </div>

        {/* Items derecha */}
        {RIGHT_ITEMS.map((item) => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              className={`${styles.item} ${active ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className={styles.iconWrapper}>
                {active && <div className={styles.activePill} />}
                <div className={styles.icon}>{item.icon}</div>
              </div>
            </button>
          )
        })}

      </div>
    </nav>
  )
}