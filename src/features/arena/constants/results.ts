import type { AnimationTokagotchi } from "@/shared/domain/tokagotchi";
import type { ColorVariant } from "@/shared/ui/Kit";
import type { ResultKind } from "../types/arena.types";

/** Todo lo que cambia entre un desenlace y otro, como dato. */
export interface ResultTheme {
  /** Palabra grande. */
  title: string;
  /** Qué pasó, en una línea. */
  subtitle: string;
  /** Encabeza el bloque de recompensas. */
  rewardLead: string;
  accent: ColorVariant;
  /** Color del veredicto y de los rayos del fondo. */
  glow: string;
  /** Rayos girando detrás del Tokagotchi. Solo en lo que se celebra. */
  rays: boolean;
  /** Confeti cayendo. Solo en la victoria de verdad. */
  confetti: boolean;
  /** Qué hace el Tokagotchi mientras se leen los resultados. */
  animation: AnimationTokagotchi;
}

/**
 * Catálogo de desenlaces.
 *
 * Mismo patrón que `ARENA_MODES`: la pantalla de resultados se pinta entera
 * leyendo `RESULT_THEMES[kind]`, así que añadir un desenlace es añadir una
 * entrada y ningún componente cambia.
 *
 * La celebración está graduada a propósito. Ganar peleando trae rayos y
 * confeti; ganar porque el otro se fue paga lo mismo pero **no se festeja
 * igual**, porque no lo ganaste. Y una derrota no se disfraza: se dice, y se
 * enseña lo que sí te llevas.
 *
 * Las animaciones son provisionales, como en el combate: no hay `victoria` ni
 * `derrota` rigueadas, así que se cubren con las de cuidado.
 */
export const RESULT_THEMES: Record<ResultKind, ResultTheme> = {
  WIN: {
    title: "¡Victoria!",
    subtitle: "Ganaste el combate",
    rewardLead: "Te llevas",
    accent: "legend",
    glow: "rgba(255, 205, 92, .95)",
    rays: true,
    confetti: true,
    animation: "jugar",
  },

  ABANDON: {
    title: "Ganaste",
    subtitle: "Tu rival abandonó el combate",
    rewardLead: "Te llevas lo mismo que una victoria",
    accent: "gold",
    glow: "rgba(247, 185, 44, .7)",
    rays: true,
    confetti: false,
    animation: "idle",
  },

  DRAW: {
    title: "Empate",
    subtitle: "Los dos cayeron en el mismo turno",
    rewardLead: "Te llevas",
    accent: "cream",
    glow: "rgba(255, 251, 241, .95)",
    rays: false,
    confetti: false,
    animation: "idle",
  },

  LOSS: {
    title: "Derrota",
    subtitle: "Tu Tokagotchi cayó en el ruedo",
    rewardLead: "Aun así te llevas",
    accent: "cafe",
    // Tono claro, no marrón: el veredicto va sobre un velo oscuro y en café se
    // perdía. Apagado no quiere decir ilegible.
    glow: "rgba(226, 196, 160, .95)",
    rays: false,
    confetti: false,
    animation: "curacion",
  },
};

/**
 * Lo que el backend paga, de `persistBattleResults`.
 *
 * **Solo se usa como respaldo.** La pantalla muestra lo que de verdad cambió
 * en el perfil del jugador, comparándolo antes y después del combate: si el
 * backend ajusta los números, la pantalla sigue diciendo la verdad sin que
 * nadie toque esta tabla. Esto es para cuando la comparación no da nada útil
 * —el perfil ya venía revalidado, por ejemplo— y enseñar "+0" sería peor.
 */
export const EXPECTED_REWARDS: Record<ResultKind, { tf: number; cp: number }> = {
  WIN: { tf: 10, cp: 5 },
  ABANDON: { tf: 10, cp: 5 },
  DRAW: { tf: 3, cp: 1 },
  LOSS: { tf: 3, cp: 1 },
};
