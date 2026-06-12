
/**
 * Método para calcular el timepo
 * @param endsAt 
 * @returns 
 */
export function getTimeLeft(endsAt: string) {
  const ms = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const minutes = Math.ceil(ms / 60000);
  return {
    minutes,
    hours: Math.floor(minutes / 60),
    mins: minutes % 60,
    done: ms === 0,
  };
}