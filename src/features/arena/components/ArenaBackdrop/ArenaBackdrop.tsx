import { ARENA_MODES, ARENA_MODE_ORDER } from '../../constants/modes'
import type { ArenaMode } from '../../types/arena.types'
import styles from './ArenaBackdrop.module.css'

interface ArenaBackdropProps {
  mode: ArenaMode
}

/**
 * Escenario de fondo de la arena, compartido por todas las secciones.
 *
 * Apila los fondos de todos los modos y solo cambia la opacidad: el cambio de
 * arena se ve como un fundido en vez de un salto, y ambas imágenes quedan
 * precargadas desde el primer render. El tinte del modo va encima para
 * unificar el escenario.
 */
export default function ArenaBackdrop({ mode }: ArenaBackdropProps) {
  const theme = ARENA_MODES[mode]

  return (
    <div className={styles.backdrop} aria-hidden="true">
      {ARENA_MODE_ORDER.map((id) => (
        <div
          key={id}
          className={`${styles.bg} ${id === mode ? styles.bgActive : ''}`}
          style={{ backgroundImage: `url('${ARENA_MODES[id].background}')` }}
        />
      ))}
      <div className={styles.tint} style={{ background: theme.aura.tint }} />
    </div>
  )
}
