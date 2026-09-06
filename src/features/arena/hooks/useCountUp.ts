import { useEffect, useState } from "react";

/** Cuánto tarda la cifra en llegar a su valor. */
const DURATION_MS = 700;

/** Sin movimiento, o sin nada que contar, la cifra se pone y ya. */
function skipsAnimation(target: number): boolean {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  return reduced || target <= 0;
}

/**
 * Cifra que sube desde cero hasta `target`.
 *
 * Se apoya en `requestAnimationFrame` y no en un intervalo: así avanza al
 * ritmo del refresco de la pantalla, no acumula desfase, y se detiene sola
 * cuando la pestaña pasa a segundo plano.
 *
 * Con `prefers-reduced-motion` el valor final ya sale del estado inicial, sin
 * un fotograma en cero: el dato es lo que importa, la animación es el adorno.
 */
export function useCountUp(target: number): number {
  const [value, setValue] = useState(() => (skipsAnimation(target) ? target : 0));

  useEffect(() => {
    // El objetivo pudo cambiar después del primer render; un fotograma basta
    // para corregirlo sin animar.
    if (skipsAnimation(target)) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      // Desaceleración al final: la cifra "aterriza" en vez de cortarse
      const eased = 1 - (1 - progress) ** 3;

      setValue(Math.round(target * eased));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}
