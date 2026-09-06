import type { Potion, PotionId } from "../types/arena.types";

const BASE = "/assets/arena/potions";

/**
 * Catálogo de pociones de combate.
 *
 * Nombres, precios y límites salen de `PotionType` del backend, literales: es
 * el mismo texto que el servidor escribe en la narrativa del combate ("usó
 * Poción de Vida Menor y curó 30 HP"), así que la UI y el log tienen que decir
 * lo mismo. La imagen y el tinte son lo único que pone el front.
 */
export const POTIONS_META: Record<PotionId, Potion> = {
  MINOR_HEALTH: {
    id: "MINOR_HEALTH",
    name: "Poción de Vida Menor",
    description: "Cura 30 HP",
    image: `${BASE}/lesser_healing_potion.svg`,
    tint: "#E8607A",
    price: 15,
    limitPerBattle: 2,
  },
  MAJOR_HEALTH: {
    id: "MAJOR_HEALTH",
    name: "Poción de Vida Mayor",
    description: "Cura 75 HP",
    image: `${BASE}/greater_healing_potion.svg`,
    tint: "#D8365A",
    price: 40,
    limitPerBattle: 1,
  },
  ENERGY_BREW: {
    id: "ENERGY_BREW",
    name: "Brebaje de Energía",
    description: "+40 NRG",
    image: `${BASE}/energy_brew_potion.svg`,
    tint: "#46A8DC",
    price: 20,
    limitPerBattle: 2,
  },
  PURIFICATION_TONIC: {
    id: "PURIFICATION_TONIC",
    name: "Tónico de Purificación",
    description: "Limpia los estados alterados",
    image: `${BASE}/purification_tonic_potion.svg`,
    tint: "#9D74D6",
    price: 15,
    limitPerBattle: 1,
  },
  WRATH_ELIXIR: {
    id: "WRATH_ELIXIR",
    name: "Elíxir de Furia",
    description: "+25% ATK · 2 turnos",
    image: `${BASE}/fury_elixir_potion.svg`,
    tint: "#F08A4B",
    price: 30,
    limitPerBattle: 1,
  },
  IRON_SHIELD: {
    id: "IRON_SHIELD",
    name: "Poción de Escudo de Hierro",
    description: "+30% DEF · 2 turnos",
    image: `${BASE}/iron_shield_potion.svg`,
    tint: "#6FC04A",
    price: 30,
    limitPerBattle: 1,
  },
};

/**
 * Tope total de pociones que se llevan a un combate.
 *
 * No son tres ranuras con una poción distinta cada una: `POST /potions/equip`
 * acepta cantidad por tipo, con este total como techo y `limitPerBattle` por
 * tipo. Dos de Vida Menor y un Brebaje es un equipamiento válido.
 */
export const POTION_SLOT_COUNT = 3;
