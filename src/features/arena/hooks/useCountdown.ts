import { useEffect, useState } from "react";

/**
 * Milisegundos que faltan para `targetAt`, refrescados cada segundo.
 *
 * El valor se deriva en el render a partir del reloj: el efecto solo mueve el
 * reloj, nunca el resultado. Devuelve 0 cuando ya se cumplió y cuando
 * `targetAt` es null, así que el consumidor solo mira el valor para saber si
 * hay cuenta atrás viva.
 */
export function useCountdown(targetAt: number | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (targetAt === null) return;

    const id = window.setInterval(() => {
      const tick = Date.now();
      setNow(tick);
      // Una vez cumplido el plazo no queda nada que contar
      if (tick >= targetAt) window.clearInterval(id);
    }, 1000);

    return () => window.clearInterval(id);
  }, [targetAt]);

  if (targetAt === null) return 0;
  return Math.max(0, targetAt - now);
}
