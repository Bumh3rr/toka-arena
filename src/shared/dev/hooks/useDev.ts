import { getApiErrorMessage } from "@/shared/api/client";
import type { Species, Rarity } from "@/shared/domain/tokagotchi";
import { useToast } from "@/shared/hooks/useToast";
import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";
import { devApi } from "../api/dev.api";

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

  const addTF = async (amount?: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await devApi.addTF(amount || 0);
      show(`Agrego ${amount ?? 0} TF`, { variant: "info" });
      await globalMutate("home");
      return data;
    } catch (err) {
      const msg = getApiErrorMessage(err) || "Error adding TF";
      setError(msg);
      show(msg, { variant: "danger", position: "top" });
    } finally {
      setLoading(false);
    }
  }

  const addTokagotchi = async (species: Species, rarity: Rarity) => {
    setLoading(true);
    setError(null);

    try {
      const data = await devApi.addTokagotchi(species, rarity);
      show(`Agrego Tokagotchi: ${species} - ${rarity}`, { variant: "info" });
      await globalMutate("home");
      return data;
    } catch (err) {
      const msg = getApiErrorMessage(err) || "Error adding Tokagotchi";
      setError(msg);
      show(msg, { variant: "danger", position: "top" });
    } finally {
      setLoading(false);
    }
  }

  return { resetCooldown, resetRarity, addCP, addTF, addTokagotchi, loading, error, toast };
}
