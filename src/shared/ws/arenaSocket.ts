import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * Cliente STOMP de la arena.
 *
 * El backend expone `/ws-arena` con `.withSockJS()`, así que se usa SockJS y
 * no un WebSocket pelado: dentro del webview de la super app no controlamos si
 * el enlace permite el *upgrade* a WebSocket, y SockJS cae solo a transportes
 * sobre HTTP cuando no puede. Un WebSocket crudo sería menos código pero sin
 * ninguna red de seguridad.
 *
 * Hay **una sola conexión por sesión**, viva desde que la app arranca y no
 * desde que se entra a la arena: `match-found` e `invitations` llegan cuando
 * el servidor decide, no cuando el jugador abre una pantalla.
 */

/** Canales privados del jugador. El servidor los prefija con `/user`. */
export const CHANNELS = {
  matchFound: "/user/queue/match-found",
  errors: "/user/queue/errors",
  invitations: "/user/queue/invitations",
} as const;

/** Destino de las acciones de combate. */
export const BATTLE_ACTION_DESTINATION = "/app/battle/action";

/** Sala de una batalla concreta. */
export function battleTopic(battleId: string): string {
  return `/topic/battle/${battleId}`;
}

/**
 * URL del endpoint SockJS.
 *
 * Se puede fijar con `VITE_WS_URL`; si no, se deriva de la URL de la API
 * quitándole el prefijo `/api/v1`, que es como está montado el backend.
 */
export function resolveSocketUrl(): string {
  const explicit = import.meta.env.VITE_WS_URL;
  if (explicit) return explicit;

  const api = import.meta.env.VITE_API_URL ?? "";
  return `${api.replace(/\/api\/v1\/?$/, "")}/ws-arena`;
}

export type SocketStatus = "idle" | "connecting" | "online" | "offline";

interface Listeners {
  onStatus: (status: SocketStatus) => void;
}

type Handler = (message: IMessage) => void;

/**
 * Envoltura del cliente STOMP.
 *
 * Guarda los oyentes para poder **rehacer las suscripciones al reconectar**:
 * STOMP no las conserva entre sesiones, y sin esto una caída de red dejaría la
 * app conectada pero sorda.
 *
 * Admite varios oyentes por destino con **una sola suscripción STOMP** que los
 * reparte. Con un oyente por destino, dos vistas interesadas en el mismo canal
 * —el de errores, por ejemplo— se pisarían y la segunda dejaría muda a la
 * primera, sin ningún síntoma hasta que alguien echara de menos un mensaje.
 */
export class ArenaSocket {
  private client: Client | null = null;
  private status: SocketStatus = "idle";

  private handlers = new Map<string, Set<Handler>>();
  private subscriptions = new Map<string, StompSubscription>();

  private readonly listeners: Listeners;

  constructor(listeners: Listeners) {
    this.listeners = listeners;
  }

  connect(token: string) {
    if (this.client) return;

    const client = new Client({
      // SockJS no es un WebSocket: se entrega por fábrica, no por `brokerURL`
      webSocketFactory: () => SockJS(resolveSocketUrl()) as unknown as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      // El servidor autentica en el CONNECT; si el token caducó, no reconecta
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.setStatus("online");
        // STOMP no conserva las suscripciones entre sesiones
        this.handlers.forEach((_, destination) => this.attach(destination));
      },
      onWebSocketClose: () => {
        this.subscriptions.clear();
        this.setStatus("offline");
      },
      onStompError: () => this.setStatus("offline"),
    });

    this.client = client;
    this.setStatus("connecting");
    client.activate();
  }

  disconnect() {
    this.handlers.clear();
    this.subscriptions.clear();
    void this.client?.deactivate();
    this.client = null;
    this.setStatus("idle");
  }

  /**
   * Escucha un destino. Devuelve la función para dejar de escucharlo.
   *
   * Se puede llamar antes de que la conexión esté lista: la suscripción queda
   * anotada y se hace efectiva en cuanto conecte.
   */
  subscribe(destination: string, handler: Handler): () => void {
    const listeners = this.handlers.get(destination) ?? new Set<Handler>();
    listeners.add(handler);
    this.handlers.set(destination, listeners);

    // La suscripción STOMP es una por destino, no una por oyente
    if (!this.subscriptions.has(destination)) this.attach(destination);

    return () => {
      listeners.delete(handler);
      if (listeners.size > 0) return;

      this.handlers.delete(destination);
      this.subscriptions.get(destination)?.unsubscribe();
      this.subscriptions.delete(destination);
    };
  }

  /** Envía un mensaje. Se descarta en silencio si no hay conexión. */
  publish(destination: string, body: unknown): boolean {
    if (!this.client?.connected) return false;

    this.client.publish({ destination, body: JSON.stringify(body) });
    return true;
  }

  getStatus(): SocketStatus {
    return this.status;
  }

  /** Abre la suscripción STOMP de un destino y reparte a todos sus oyentes. */
  private attach(destination: string) {
    if (!this.client?.connected) return;

    const subscription = this.client.subscribe(destination, (message) => {
      this.handlers.get(destination)?.forEach((handler) => handler(message));
    });

    this.subscriptions.set(destination, subscription);
  }

  private setStatus(next: SocketStatus) {
    if (this.status === next) return;
    this.status = next;
    this.listeners.onStatus(next);
  }
}
