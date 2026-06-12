/**
 * Control global de visibilidad del BottomNav.
 *
 * El NavBarProvider vive en AppLayout y sobrevive a la navegación entre rutas.
 * Cualquier página puede consumir useNavBar() para ocultar/mostrar el nav.
 *
 * Uso en una página:
 *   const { hideBar, showBar } = useNavBar()
 *   useEffect(() => {
 *     hideBar()
 *     return () => showBar()   // restaura al salir de la página
 *   }, [hideBar, showBar])
 */
import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface NavBarCtx {
  hidden:  boolean
  showBar:    () => void
  hideBar:    () => void
}

const NavBarContext = createContext<NavBarCtx>({
  hidden: false,
  showBar:   () => {},
  hideBar:   () => {},
})

export function NavBarProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false)
  const showBar = useCallback(() => setHidden(false), [])
  const hideBar = useCallback(() => setHidden(true),  [])
  return (
    <NavBarContext.Provider value={{ hidden, showBar, hideBar }}>
      {children}
    </NavBarContext.Provider>
  )
}

export function useNavBar(): NavBarCtx {
  return useContext(NavBarContext)
}
