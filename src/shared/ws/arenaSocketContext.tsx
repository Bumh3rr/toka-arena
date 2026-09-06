import { createContext, useContext } from 'react'
import type { IMessage } from '@stomp/stompjs'
import type { SocketStatus } from './arenaSocket'

export interface ArenaSocketCtx {
  status: SocketStatus
  /** true solo cuando el servidor puede recibir y entregar mensajes. */
  online: boolean
  subscribe: (destination: string, handler: (message: IMessage) => void) => () => void
  publish: (destination: string, body: unknown) => boolean
}

const noop = () => () => {}

/**
 * Contexto de la conexión con la arena.
 *
 * Vive aparte del provider porque `react-refresh` exige que un módulo que
 * exporta componentes no exporte nada más; y aparte del hook para que el
 * provider no tenga que importarse a sí mismo.
 */
export const ArenaSocketContext = createContext<ArenaSocketCtx>({
  status: 'idle',
  online: false,
  subscribe: noop,
  publish: () => false,
})

/** Acceso a la conexión de la arena desde cualquier vista. */
export function useArenaSocket(): ArenaSocketCtx {
  return useContext(ArenaSocketContext)
}
