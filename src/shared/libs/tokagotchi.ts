import type { Species, Assets } from "../types/tokagotchi";

export function getAssetsBySpecies(especie: Species): Assets {
  const assets: Record<Species, Assets> = {
    TOFU: {
      armatureKey: "tofu",
      texPng: "/assets/tofu/tofu_tex.png",
      texJson: "/assets/tofu/tofu_tex.json",
      skeJson: "/assets/tofu/tofu_ske.json",
    },
    MOCHI: {
      armatureKey: "mochi",
      texPng: "/assets/mochi/mochi_tex.png",
      texJson: "/assets/mochi/mochi_tex.json",
      skeJson: "/assets/mochi/mochi_ske.json",
    },
    HANA: {
      armatureKey: "hana",
      texPng: "/assets/hana/hana_tex.png",
      texJson: "/assets/hana/hana_tex.json",
      skeJson: "/assets/hana/hana_ske.json",
    },
  };
  return assets[especie];
}

export function getImagenSrcByEspecie(especie: Species): string {
  const url = "/assets/tokagotchis/png/";
  const map: Record<Species, string> = {
    TOFU: `${url}tofu.png`,
    MOCHI: `${url}mochi.png`,
    HANA: `${url}hana.png`,
  };
  return map[especie];
}