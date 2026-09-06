import api from "@/shared/api/client";
import type {
  BattleHistoryPageDTO,
  BattleStateDTO,
  PlayerPotionDTO,
  QueueStatusDTO,
} from "./dto/arena.dto";
import type { PotionId } from "../types/arena.types";

/**
 * Endpoints REST del módulo de arena.
 *
 * El combate en sí no está aquí: las acciones viajan por WebSocket
 * (`/app/battle/action`) y el estado llega por `/topic/battle/{id}`. Lo que
 * queda en REST es entrar y salir de la cola, recuperar una batalla, rendirse,
 * el historial y las pociones.
 */
export const arenaApi = {
  // ── Emparejamiento ────────────────────────────────────────────────────────

  /**
   * Entra a la cola.
   *
   * El servidor valida que haya Tokagotchi principal, estamina y que no haya
   * otra batalla en curso. **El emparejamiento no llega por aquí**: se anuncia
   * por `/user/queue/match-found`.
   */
  async joinQueue(): Promise<QueueStatusDTO> {
    const { data } = await api.post<QueueStatusDTO>("/matchmaking/queue");
    return data;
  },

  /** Sale de la cola. Idempotente: responde igual aunque no estuviera. */
  async leaveQueue(): Promise<void> {
    await api.delete("/matchmaking/queue");
  },

  /** Estado de la cola. Solo para el contador de espera, no para detectar el match. */
  async getQueueStatus(): Promise<QueueStatusDTO> {
    const { data } = await api.get<QueueStatusDTO>("/matchmaking/queue");
    return data;
  },

  // ── Combate ───────────────────────────────────────────────────────────────

  /**
   * Batalla activa del jugador, sin conocer su id.
   *
   * Es el caso de recargar la app en mitad de un combate. Devuelve `null` si
   * no hay ninguna, que es la respuesta normal.
   */
  async getActiveBattle(): Promise<BattleStateDTO | null> {
    try {
      const { data } = await api.get<BattleStateDTO>("/battles/active");
      return data;
    } catch {
      // 404 es el caso corriente: no hay batalla en curso
      return null;
    }
  },

  /** Estado de una batalla concreta. Para reconectar con el id ya conocido. */
  async getBattle(battleId: string): Promise<BattleStateDTO> {
    const { data } = await api.get<BattleStateDTO>(`/battles/${battleId}`);
    return data;
  },

  /**
   * Abandona el combate.
   *
   * Se resuelve de inmediato como derrota para quien se va y victoria para el
   * rival, con las mismas recompensas y el mismo consumo de estamina que un
   * combate normal.
   */
  async surrender(battleId: string): Promise<void> {
    await api.delete(`/battles/${battleId}`);
  },

  /** Historial paginado del jugador, del más reciente al más antiguo. */
  async getMyBattles(page: number, size: number): Promise<BattleHistoryPageDTO> {
    const { data } = await api.get<BattleHistoryPageDTO>("/battles/mine", {
      params: { page, size },
    });
    return data;
  },

  // ── Pociones ──────────────────────────────────────────────────────────────

  /** Inventario del jugador, con lo que tiene y lo que lleva equipado. */
  async getPotions(): Promise<PlayerPotionDTO[]> {
    const { data } = await api.get<PlayerPotionDTO[]>("/potions/inventory");
    return data;
  },

  /**
   * Fija el equipamiento del próximo combate.
   *
   * Reemplaza el loadout completo: lo que no se manda queda a cero. El techo
   * es de 3 unidades en total, y cada tipo tiene además su `limitPerBattle`.
   */
  async equipPotions(items: { potionType: PotionId; quantity: number }[]): Promise<PlayerPotionDTO[]> {
    const { data } = await api.post<PlayerPotionDTO[]>("/potions/equip", { items });
    return data;
  },
};
