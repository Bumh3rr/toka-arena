import { useState } from 'react'
import LobbySection from '../sections/LobbySection/LobbySection'
import type { ArenaPhase } from '../types/arena.types'
import styles from './ArenaPage.module.css'

/**
 * Pantalla de arena.
 *
 * Solo enruta la fase activa: cada fase es una sección independiente que se
 * pinta a pantalla completa. Hoy únicamente existe el lobby; las secciones de
 * búsqueda, batalla y resultados se enchufan aquí como casos nuevos.
 */
export default function ArenaPage() {
  const [phase] = useState<ArenaPhase>('LOBBY')

  return (
    <div className={styles.page}>
      {phase === 'LOBBY' && <LobbySection />}
      {/* MATCHMAKING · BATTLE · RESULT — secciones pendientes */}
    </div>
  )
}
