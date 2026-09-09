import { useCallback, useEffect, useState } from "react";
import { useNavBar } from "@/shared/hooks/useNavBar";

/** Paneles deslizantes del lobby. Solo uno puede estar abierto a la vez. */
export type ArenaPanelId = "toka" | "mode" | "potions" | "history";

interface UseArenaPanelResult {
  /** Panel abierto, o null si el cajón está cerrado. */
  panel: ArenaPanelId | null;
  open: (panel: ArenaPanelId) => void;
  close: () => void;
  /** Estado que consume SheetPanel. */
  expanded: boolean;
  /** Handler para el `onExpandedChange` de SheetPanel (cerrar al arrastrar). */
  setExpanded: (expanded: boolean) => void;
}

/**
 * Controla el cajón del lobby: qué panel muestra y la visibilidad del nav.
 *
 * Igual que Home, mientras el cajón está abierto el BottomNav se esconde para
 * dejarle la pantalla completa al panel.
 */
export function useArenaPanel(): UseArenaPanelResult {
  const [panel, setPanel] = useState<ArenaPanelId | null>(null);
  const { hideBar, showBar } = useNavBar();

  useEffect(() => {
    if (panel) hideBar();
    else showBar();
  }, [panel, hideBar, showBar]);

  // El nav se restaura al salir de la arena aunque el cajón quede abierto.
  useEffect(() => () => showBar(), [showBar]);

  const open = useCallback((next: ArenaPanelId) => setPanel(next), []);
  const close = useCallback(() => setPanel(null), []);

  const setExpanded = useCallback((next: boolean) => {
    if (!next) setPanel(null);
  }, []);

  return { panel, open, close, expanded: panel !== null, setExpanded };
}
