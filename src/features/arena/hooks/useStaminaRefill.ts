import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";
import api, { getApiErrorMessage } from "@/shared/api/client";
import type { PlayerProfileDTO } from "@/shared/player/api/player.dto";
import { mapPlayerProfileDTO } from "@/shared/player/data/player.mapper";
import { REFILL_COST_TF } from "../lib/stamina";

interface RefillMessage {
  ok: boolean;
  text: string;
}

interface UseStaminaRefillResult {
  /** Compra una recarga completa. Devuelve qué decirle al jugador. */
  refillStamina: () => Promise<RefillMessage>;
  busy: boolean;
}

/**
 * Compra de estamina.
 *
 * El endpoint devuelve el perfil ya actualizado, así que se siembra
 * directamente en la caché `'player'` en lugar de pedirlo otra vez: la barra
 * del lobby y el saldo de TF se corrigen en el mismo instante.
 *
 * El límite de recargas diarias y el cobro los impone el servidor; aquí no se
 * replica esa validación, solo se traduce su negativa al jugador.
 */
export function useStaminaRefill(): UseStaminaRefillResult {
  const { mutate } = useSWRConfig();
  const [busy, setBusy] = useState(false);

  const refillStamina = useCallback(async (): Promise<RefillMessage> => {
    if (busy) return { ok: false, text: "Espera un momento..." };

    setBusy(true);
    try {
      const { data } = await api.post<PlayerProfileDTO>("/players/me/stamina-refill");

      // El perfil que responde ya trae la estamina y el saldo nuevos
      await mutate("player", mapPlayerProfileDTO(data), { revalidate: false });

      return { ok: true, text: `Estamina al máximo por ${REFILL_COST_TF} TF` };
    } catch (error) {
      return { ok: false, text: getApiErrorMessage(error, "No se pudo recargar la estamina") };
    } finally {
      setBusy(false);
    }
  }, [busy, mutate]);

  return { refillStamina, busy };
}
