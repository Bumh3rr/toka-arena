// features/home/hooks/homeUiReducer.ts
import type { AnimationTokagotchi } from "@/shared/types/tokagotchi";
import type { ActionCare } from "../data/types"; // "feed" | "play" | "bathe"

export type Floaters = Partial<Record<ActionCare, number>>;
export interface HomeUi {
  animation: AnimationTokagotchi;
  pendingAction: ActionCare | null;
  floaters: Floaters;
}
export const INITIAL_UI: HomeUi = {
  animation: "idle",
  pendingAction: null,
  floaters: {},
};

export type UiAction =
  | { type: "ACTION_START"; action: ActionCare }
  | { type: "ACTION_END" }
  | { type: "SET_ANIMATION"; animation: AnimationTokagotchi }
  | { type: "ADD_FLOATER"; action: ActionCare; id: number }
  | { type: "REMOVE_FLOATER"; action: ActionCare; id: number };

export function homeUiReducer(ui: HomeUi, a: UiAction): HomeUi {
  switch (a.type) {
    case "ACTION_START":
      return { ...ui, pendingAction: a.action };
    case "ACTION_END":
      return { ...ui, pendingAction: null };
    case "SET_ANIMATION":
      return { ...ui, animation: a.animation };
    case "ADD_FLOATER":
      return { ...ui, floaters: { ...ui.floaters, [a.action]: a.id } };
    case "REMOVE_FLOATER": {
      if (ui.floaters[a.action] !== a.id) return ui;
      const floaters = { ...ui.floaters };
      delete floaters[a.action];
      return { ...ui, floaters };
    }
    default:
      return ui;
  }
}
