import type { Species } from "@/shared/domain/tokagotchi";
import type { Skill, SkillId } from "../types/arena.types";

/**
 * Movesets de combate.
 *
 * Especie, costo de energía, multiplicador y efecto salen literales de
 * `SkillType` del backend: son las reglas con las que pelea el servidor, y si
 * la tarjeta anuncia otra cosa el jugador toma decisiones con datos falsos.
 *
 * El **nombre en español lo pone el front**, y solo porque el backend no lo
 * tiene: `SkillType` guarda `"BITE"` y la narrativa del combate lo escribe así
 * tal cual. `PotionType` sí trae `displayName` en español, así que la
 * inconsistencia es del backend y ya tiene precedente para arreglarse —
 * cuando añada `displayName` a `SkillType`, el log pasa a español solo y estas
 * etiquetas se pueden retirar.
 */
export const SKILLS: Record<SkillId, Skill> = {
  // ── TOFU · Bruiser ──────────────────────────────────────────────────────
  BITE: {
    id: "BITE",
    species: "TOFU",
    label: "Mordida",
    energyCost: 15,
    effect: "Daño ×1.20",
    isSignature: false,
  },
  ROAR: {
    id: "ROAR",
    species: "TOFU",
    label: "Ladrido",
    energyCost: 25,
    effect: "+20% ATK · 2 turnos",
    isSignature: false,
  },
  GUARD: {
    id: "GUARD",
    species: "TOFU",
    label: "Guardia",
    energyCost: 25,
    effect: "−40% daño recibido",
    isSignature: false,
  },
  LOYALTY: {
    id: "LOYALTY",
    species: "TOFU",
    label: "Lealtad",
    energyCost: 60,
    effect: "Daño ×1.80 · cura 30% del daño",
    isSignature: true,
  },

  // ── MOCHI · Asesino ─────────────────────────────────────────────────────
  CLAW: {
    id: "CLAW",
    species: "MOCHI",
    label: "Zarpazo",
    energyCost: 15,
    effect: "Daño ×1.10 · ignora 20% DEF",
    isSignature: false,
  },
  AGILITY: {
    id: "AGILITY",
    species: "MOCHI",
    label: "Agilidad",
    energyCost: 35,
    effect: "Esquiva el próximo ataque",
    isSignature: false,
  },
  WEAKEN: {
    id: "WEAKEN",
    species: "MOCHI",
    label: "Debilitar",
    energyCost: 25,
    effect: "−25% DEF rival · 2 turnos",
    isSignature: false,
  },
  FRENZY: {
    id: "FRENZY",
    species: "MOCHI",
    label: "Frenesí",
    energyCost: 60,
    effect: "Dos golpes · crítico extra si conectan",
    isSignature: true,
  },

  // ── HANA · Tanque ───────────────────────────────────────────────────────
  TACKLE: {
    id: "TACKLE",
    species: "HANA",
    label: "Embate",
    energyCost: 15,
    effect: "Daño ×1.00",
    isSignature: false,
  },
  BARK_SHIELD: {
    id: "BARK_SHIELD",
    species: "HANA",
    label: "Escudo de Corteza",
    energyCost: 25,
    effect: "Escudo del 20% de tu HP · 3 turnos",
    isSignature: false,
  },
  REGENERATION: {
    id: "REGENERATION",
    species: "HANA",
    label: "Regeneración",
    energyCost: 35,
    effect: "+5% HP por turno · 3 turnos",
    isSignature: false,
  },
  ANCESTRAL_FOREST: {
    id: "ANCESTRAL_FOREST",
    species: "HANA",
    label: "Bosque Ancestral",
    energyCost: 60,
    effect: "Refleja 40% del daño · 2 turnos",
    isSignature: true,
  },
};

/**
 * Orden en que se pintan las cuatro tarjetas de cada especie: básica,
 * utilidad, utilidad y firma al final, que es la que cuesta 60 NRG.
 */
const MOVESETS: Record<Species, SkillId[]> = {
  TOFU: ["BITE", "ROAR", "GUARD", "LOYALTY"],
  MOCHI: ["CLAW", "WEAKEN", "AGILITY", "FRENZY"],
  HANA: ["TACKLE", "BARK_SHIELD", "REGENERATION", "ANCESTRAL_FOREST"],
};

/**
 * Habilidades de una especie.
 *
 * El servidor valida `skill.getRequiredSpecies()` y rechaza la acción, pero
 * ofrecer un botón que va a fallar es peor que no ofrecerlo.
 */
export function movesetOf(species: Species): Skill[] {
  return MOVESETS[species].map((id) => SKILLS[id]);
}
