import { useNavigate, useLocation } from 'react-router-dom'
import styles from './BottomNav.module.css'

const LEFT_ITEMS = [
  {
    label: 'Inicio',
    path: '/home',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
          fill={active ? '#F97316' : 'none'}
          stroke={active ? '#F97316' : '#8C6B4A'}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    label: 'Misiones',
    path: '/misiones',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="5" y="3" width="14" height="18" rx="2"
          fill={active ? '#F97316' : 'none'}
          stroke={active ? '#F97316' : '#8C6B4A'}
          strokeWidth="2"
        />
        <path
          d="M9 8H15M9 12H15M9 16H12"
          stroke={active ? '#FFF8E7' : '#8C6B4A'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }
]

const RIGHT_ITEMS = [
  {
    label: 'Colección',
    path: '/coleccion',
    icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill={active ? '#F97316' : 'none'}
          stroke={active ? '#F97316' : '#8C6B4A'}
          strokeWidth="1"
          strokeLinejoin="round"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.948 1.25h.104c.899 0 1.648 0 2.242.08c.628.084 1.195.27 1.65.725c.456.456.642 1.023.726 1.65c.06.44.075.964.079 1.57c.648.021 1.226.06 1.74.128c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238a18 18 0 0 1 1.74-.128c.004-.606.02-1.13.079-1.57c.084-.627.27-1.194.725-1.65c.456-.455 1.023-.64 1.65-.725c.595-.08 1.345-.08 2.243-.08M8.752 5.252q.567-.003 1.192-.002h4.112q.625 0 1.192.002c-.004-.57-.018-1-.064-1.347c-.063-.461-.17-.659-.3-.789s-.328-.237-.79-.3c-.482-.064-1.13-.066-2.094-.066s-1.612.002-2.095.067c-.461.062-.659.169-.789.3s-.237.327-.3.788c-.046.346-.06.776-.064 1.347M5.71 6.89c-1.006.135-1.586.389-2.01.812c-.422.423-.676 1.003-.811 2.009c-.138 1.027-.14 2.382-.14 4.289s.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289s-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14"
        />
        <path
          fill="#969696"
          d="M17 9a1 1 0 1 1-2 0a1 1 0 0 1 2 0M9 9a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
        />
      </svg>
    )
  },
  {
    label: 'Tienda',
    path: '/tienda',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 4H5.5L7.5 14H18.5L20.5 7H6.5"
          stroke={active ? '#F97316' : '#8C6B4A'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="18" r="1.5" fill={active ? '#F97316' : '#8C6B4A'} />
        <circle cx="17" cy="18" r="1.5" fill={active ? '#F97316' : '#8C6B4A'} />
      </svg>
    )
  }
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const isArenaActive = location.pathname === '/arena'

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
                <div className={styles.icon}>{item.icon(active)}</div>
              </div>
              <span className={styles.label}>{item.label}</span>
            </button>
          )
        })}

        {/* Espacio invisible donde flota el botón arena */}
        <div className={styles.arenaPlaceholder} />

        {/* Botón Arena flotante */}
        <button
          className={`${styles.arenaWrapper} ${isArenaActive ? styles.active : ''}`}
          onClick={() => navigate('/arena')}
        >
          <div className={styles.arenaBtn}>
            <svg className={styles.arenaIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#FFF8E7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M2 19.2L3.8 21m.9-7.2l.9 3.6m0 0l3.6.9m-3.6-.9l-2.7 2.7M16.4 3.9l-9 9l.45 2.25l2.25.45l9-9L20 3z" /><path d="M22 19.2L20.2 21m-.9-7.2l-.9 3.6m0 0l2.7 2.7m-2.7-2.7l-1.8.45l-1.8.45M9.3 11L4.9 6.6L4 3l3.6.9L12 8.3m.1 5.5l1.8 1.8l2.25-.45l.45-2.25l-1.8-1.8" /></g></svg>
          </div>
          <span className={styles.arenaLabel}>Arena</span>
        </button>

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
                <div className={styles.icon}>{item.icon(active)}</div>
              </div>
              <span className={styles.label}>{item.label}</span>
            </button>
          )
        })}

      </div>
    </nav>
  )
}