import { useCallback, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { getApiErrorMessage } from "@/shared/api/client";
import { usePlayer } from "@/shared/player/hooks/usePlayer";
import { arenaApi } from "../api/arena.api";
import { POTIONS_META, POTION_SLOT_COUNT } from "../constants/potions";
import type { PlayerPotionDTO } from "../api/dto/arena.dto";
import type { Potion, PotionId, PotionSlot } from "../types/arena.types";

/** Clave SWR del inventario de pociones. */
export const POTIONS_KEY = "arena.potions";

export interface PotionStock {
  potion: Potion;
  /** Unidades en el inventario. */
  owned: number;
  /** Unidades reservadas para el próximo combate. */
  equipped: number;
  /** Tope de esta poción por combate. Del backend si ya la tienes. */
  limitPerBattle: number;
  /** Precio unitario en TF. */
  price: number;
  /** El saldo alcanza para comprar una unidad. */
  affordable: boolean;
}

export type PotionLoadoutState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; stock: PotionStock[]; equippedTotal: number; tf: number };

interface UsePotionLoadoutResult {
  state: PotionLoadoutState;
  /** Ranuras para la bandeja del lobby: una por unidad equipada. */
  slots: PotionSlot[];
  /** Está guardando un cambio: bloquea la interacción. */
  saving: boolean;
  /** Ajusta una poción en +1 o −1 y guarda el loadout completo. */
  adjust: (potion: PotionId, delta: number) => Promise<void>;
  /** Compra una unidad. Id de la poción en vuelo, o null. */
  buying: PotionId | null;
  buy: (potion: PotionId) => Promise<void>;
  reload: () => void;
}

/**
 * Pociones que el jugador lleva al combate.
 *
 * No son tres ranuras con una poción distinta cada una: el backend acepta
 * **cantidad por tipo**, con un techo de {@link POTION_SLOT_COUNT} unidades en
 * total y el `limitPerBattle` propio de cada poción. Dos de Vida Menor y un
 * Brebaje es un equipamiento válido.
 *
 * `POST /potions/equip` **reemplaza el loadout entero**, así que cada ajuste
 * manda la lista completa. Y el servidor lo vacía al terminar cada combate, de
 * modo que esto se vuelve a visitar antes de cada pelea: por eso guarda al
 * instante en lugar de pedir un botón de confirmar.
 */
export function usePotionLoadout(): UsePotionLoadoutResult {
  const { data, error, mutate, isLoading } = useSWR<PlayerPotionDTO[]>(
    POTIONS_KEY,
    () => arenaApi.getPotions(),
  );

  const { mutate: globalMutate } = useSWRConfig();
  const { state: playerState } = usePlayer();
  const tf = playerState.status === "ready" ? playerState.data.tf : 0;

  const [saving, setSaving] = useState(false);
  const [buying, setBuying] = useState<PotionId | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  /*
   * La lista se arma desde el catálogo estático, no desde el inventario.
   *
   * `GET /potions/inventory` solo devuelve los tipos que el jugador ha tenido
   * alguna vez, y no existe endpoint de catálogo. Si la lista saliera de ahí,
   * un jugador nuevo vería la alacena vacía y no tendría desde dónde comprar.
   * Las seis se pintan siempre y el inventario solo aporta las cantidades.
   */
  const stock = useMemo<PotionStock[]>(() => {
    const owned = new Map((data ?? []).map((dto) => [dto.potionType, dto]));

    return Object.values(POTIONS_META).map((potion) => {
      const dto = owned.get(potion.id);
      return {
        potion,
        owned: dto?.quantity ?? 0,
        equipped: dto?.equippedQuantity ?? 0,
        // El precio y el tope del backend mandan sobre los del catálogo local
        limitPerBattle: dto?.limitPerBattle ?? potion.limitPerBattle,
        price: dto?.price ?? potion.price,
        affordable: tf >= (dto?.price ?? potion.price),
      };
    });
  }, [data, tf]);

  const equippedTotal = stock.reduce((sum, item) => sum + item.equipped, 0);

  /*
   * La bandeja del lobby enseña una ranura por unidad, no por tipo: llevar dos
   * Vidas Menores ocupa dos de las tres plazas, y así se ve.
   */
  const slots = useMemo<PotionSlot[]>(() => {
    const carried = stock.flatMap((item) =>
      Array.from({ length: item.equipped }, () => item.potion),
    );

    return Array.from({ length: POTION_SLOT_COUNT }, (_, index) => ({
      index,
      potion: carried[index] ?? null,
    }));
  }, [stock]);

  const adjust = useCallback(
    async (id: PotionId, delta: number) => {
      const current = stock.find((item) => item.potion.id === id);
      if (!current) return;

      const next = current.equipped + delta;

      // El servidor valida lo mismo; comprobarlo aquí evita un viaje que ya
      // sabemos que va a fallar y un mensaje de error innecesario.
      if (next < 0 || next > current.limitPerBattle || next > current.owned) return;
      if (delta > 0 && equippedTotal >= POTION_SLOT_COUNT) return;

      const items = stock.map((item) => ({
        potionType: item.potion.id,
        quantity: item.potion.id === id ? next : item.equipped,
      }));

      setSaving(true);
      setSaveError(null);

      try {
        await arenaApi.equipPotions(items);
        await mutate();
      } catch (err) {
        setSaveError(getApiErrorMessage(err, "No se pudo equipar la poción"));
      } finally {
        setSaving(false);
      }
    },
    [stock, equippedTotal, mutate],
  );

  const buy = useCallback(
    async (id: PotionId) => {
      if (buying) return;

      const current = stock.find((item) => item.potion.id === id);
      if (!current || !current.affordable) return;

      setBuying(id);
      setSaveError(null);

      try {
        await arenaApi.buyPotion(id, 1);
        /*
         * El endpoint devuelve solo el registro de ese tipo, no el inventario
         * completo, así que se revalida en vez de parchear la caché a mano.
         * Y hay que refrescar 'player': el saldo TF acaba de bajar y lo pinta
         * la barra superior del lobby.
         */
        await Promise.all([mutate(), globalMutate("player")]);
      } catch (err) {
        setSaveError(getApiErrorMessage(err, "No se pudo comprar la poción"));
      } finally {
        setBuying(null);
      }
    },
    [buying, stock, mutate, globalMutate],
  );

  const state: PotionLoadoutState = isLoading
    ? { status: "loading" }
    : error || saveError
      ? { status: "error", error: saveError ?? getApiErrorMessage(error) }
      : { status: "ready", stock, equippedTotal, tf };

  return {
    state,
    slots,
    saving,
    adjust,
    buying,
    buy,
    reload: () => void mutate(),
  };
}
