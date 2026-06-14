import type { ConfigCare } from "../home.types"; 

export const CONFIG_CARE: ConfigCare[] = [
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
