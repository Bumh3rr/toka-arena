import type { AnimationTokagotchi } from "../types/tokagotchi";

export type AccionCuidado = "feed" | "play" | "bathe";
export interface ConfigCuidado {
  key: AccionCuidado;
  label: string;
  cp: number;
  cooldownSeg: number;
  img: string;
  animation: AnimationTokagotchi;
}

export const CUIDADO_CONFIG: ConfigCuidado[] = [
  {
    key: "feed",
    label: "Alimentar",
    cp: 5,
    cooldownSeg: 600,
    img: "/assets/ui/btn_alimentar.png",
    animation: "comer"
  },
  {
    key: "play",
    label: "Jugar",
    cp: 8,
    cooldownSeg: 1200,
    img: "/assets/ui/btn_jugar.png",
    animation: "jugar",
  },
  {
    key: "bathe",
    label: "Bañar",
    cp: 4,
    cooldownSeg: 1800,
    img: "/assets/ui/btn_ducha.png",
    animation: "bañar",
  },
];
