import { Button } from '@/shared/ui/Kit'
import styles from './ReconnectOverlay.module.css'

interface ReconnectOverlayProps {
  onLeave: () => void
}

/**
 * Velo de reconexión.
 *
 * Dice lo único que el jugador necesita saber en ese momento: que no perdió el
 * turno. El servidor guarda la sesión en Redis y el plazo del turno sigue
 * corriendo de su lado, así que la salida honesta es esperar — y dejar una
 * puerta por si prefiere irse.
 */
export default function ReconnectOverlay({ onLeave }: ReconnectOverlayProps) {
  return (
    <div className={styles.overlay} role="alertdialog" aria-label="Reconectando">
      <div className={styles.card}>
        <span className={styles.spinner} aria-hidden="true">
          <i /><i /><i />
        </span>

        <h2 className={styles.title}>Reconectando</h2>
        <p className={styles.text}>Guardamos tu turno. El temporizador está en pausa.</p>

        <Button variant="cream" size="lg" radius="lg" onClick={onLeave}>
          Salir de la batalla
        </Button>
      </div>
    </div>
  )
}
