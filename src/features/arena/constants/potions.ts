import type { Potion, PotionId } from "../types/arena.types";

const BASE = "/assets/arena/potions";

/** Catálogo de pociones que se pueden llevar al combate. */
export const POTIONS_META: Record<PotionId, Potion> = {
  LESSER_HEALING: {
    id: "LESSER_HEALING",
    name: "Poción menor",
    description: "Recupera algo de vida",
    image: `${BASE}/lesser_healing_potion.svg`,
    tint: "#E8607A",
  },
  GREATER_HEALING: {
    id: "GREATER_HEALING",
    name: "Poción mayor",
    description: "Recupera bastante vida",
    image: `${BASE}/greater_healing_potion.svg`,
    tint: "#D8365A",
  },
  FURY_ELIXIR: {
    id: "FURY_ELIXIR",
    name: "Elixir de furia",
    description: "Sube el ataque por unos turnos",
    image: `${BASE}/fury_elixir_potion.svg`,
    tint: "#F08A4B",
  },
  IRON_SHIELD: {
    id: "IRON_SHIELD",
    name: "Escudo de hierro",
    description: "Sube la defensa por unos turnos",
    image: `${BASE}/iron_shield_potion.svg`,
    tint: "#6FC04A",
  },
  ENERGY_BREW: {
    id: "ENERGY_BREW",
    name: "Brebaje de energía",
    description: "Devuelve energía para habilidades",
    image: `${BASE}/energy_brew_potion.svg`,
    tint: "#46A8DC",
  },
  PURIFICATION_TONIC: {
    id: "PURIFICATION_TONIC",
    name: "Tónico purificador",
    description: "Limpia los efectos negativos",
    image: `${BASE}/purification_tonic_potion.svg`,
    tint: "#9D74D6",
  },
};

/** Ranuras de poción que el jugador lleva al combate. */
export const POTION_SLOT_COUNT = 3;
