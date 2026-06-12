import type { EvolutionBlocker, EvolutionStatus, Evolution } from "../types/evolution"; 

export function getEvolutionStatus(
  evolution: Evolution | null,
  currentCP: number,
  userTF: number,
): EvolutionStatus {
  // Si no hay regla es por que ya esta en la maxima rareza
  if (!evolution?.rule){
    return { canEvolve: false, blocker: "MAX_RARITY", cpProgress: 1, cooldownEndsAt: null };
  }

  const { cpRequired, costTF } = evolution.rule;
  const cpProgress = Math.min(currentCP / cpRequired, 1);
  const onCooldown = !!evolution.cooldown && new Date(evolution.cooldown.endsAt).getTime() > Date.now();

  // Orden de prioridad de los bloqueos
  let blocker: EvolutionBlocker | null = null;
  if (onCooldown) blocker = "ON_COOLDOWN";
  else if (currentCP < cpRequired) blocker = "NOT_ENOUGH_CP";
  else if (userTF < costTF) blocker = "NOT_ENOUGH_TF";

  return {
    canEvolve: blocker === null,
    blocker,
    cpProgress,
    cooldownEndsAt: evolution.cooldown?.endsAt ?? null,
  };
}