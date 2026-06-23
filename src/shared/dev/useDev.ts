import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";
import { getApiErrorMessage } from "../api/client";
import { devApi } from "../api/dev.api";
import { useToast } from "../hooks/useToast";

export function useDev() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast, show } = useToast();
  const { mutate: globalMutate } = useSWRConfig();
  
  const withTokaId = useCallback(
    async <T,>(
      tokaId: string | undefined,
      action: (id: string) => Promise<T>,
      successMessage: (id: string) => string,
      errorMessage: string,
    ) => {
      setLoading(true);
      setError(null);

      if (!tokaId) {
        const msg = "No se proporcionó un ID de tokagotchi";
        setError(msg);
        show(msg, { variant: "danger", position: "top" });
        setLoading(false);
        return undefined;
      }

      try {
        const data = await action(tokaId);
        show(successMessage(tokaId), { variant: "info" });
        await globalMutate("home");
        return data;
      } catch (err) {
        const msg = getApiErrorMessage(err) || errorMessage;
        setError(msg);
        show(msg, { variant: "danger", position: "top" });
      } finally {
        setLoading(false);
      }
    },
    [globalMutate, show],
  );

  const resetCooldown = async (tokaId?: string) => {
    return withTokaId(
      tokaId,
      (id) => devApi.resetCooldown(id),
      (id) => `Reset Cooldown: ${id}`,
      "Error resetting cooldowns",
    );
  };

  const resetRarity = async (tokaId?: string) => {
    return withTokaId(
      tokaId,
      (id) => devApi.resetRarity(id),
      (id) => `Reset Rarity: ${id}`,
      "Error resetting rarity",
    );
  };

  const addCP = async (tokaId?: string, amount?: number) => {
    return withTokaId(
      tokaId,
      (id) => devApi.addCP(id, amount || 0),
      (id) => `Agrego ${amount ?? 0} CP a: ${id}`,
      "Error adding CP",
    );
  };

  return { resetCooldown, resetRarity, addCP, loading, error, toast };
}
