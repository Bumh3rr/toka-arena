import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { tokenStore } from '@/shared/player/lib/token.store'
import { ArenaSocket, type SocketStatus } from './arenaSocket'
import { ArenaSocketContext, type ArenaSocketCtx } from './arenaSocketContext'

/**
 * Mantiene viva la conexión con la arena durante toda la sesión.
 *
 * Va en el layout autenticado y no en la página de arena a propósito: el
 * servidor anuncia el emparejamiento por `/user/queue/match-found` cuando el
 * emparejador lo decide, no cuando el jugador abre una pantalla. Si la
 * conexión naciera al entrar a la arena, un match encontrado mientras el
 * jugador está en Home se perdería.
 *
 * Al expirar el token la conexión se cierra: el servidor autentica en el
 * CONNECT, así que reintentar con un token muerto solo daría vueltas.
 */
export function ArenaSocketProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SocketStatus>('idle')

  /*
   * Una sola instancia por sesión. Va en estado con inicializador perezoso y
   * no en una ref: así se crea una única vez y sin leer nada durante el render.
   */
  const [socket] = useState(() => new ArenaSocket({ onStatus: setStatus }))

  useEffect(() => {
    const token = tokenStore.get()
    if (token) socket.connect(token)

    const onExpired = () => socket.disconnect()
    window.addEventListener('auth:expired', onExpired)

    return () => {
      window.removeEventListener('auth:expired', onExpired)
      socket.disconnect()
    }
  }, [socket])

  const value = useMemo<ArenaSocketCtx>(
    () => ({
      status,
      online: status === 'online',
      subscribe: (destination, handler) => socket.subscribe(destination, handler),
      publish: (destination, body) => socket.publish(destination, body),
    }),
    [status, socket],
  )

  return <ArenaSocketContext.Provider value={value}>{children}</ArenaSocketContext.Provider>
}

