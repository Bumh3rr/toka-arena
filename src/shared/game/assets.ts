import type { Assets, Species } from "../domain/tokagotchi";

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

const ACCESSORY_IMAGES: Partial<Record<string, string>> = {
  CROWN:     '/assets/accessory/crown.png',
  HAT:       '/assets/accessory/hat.png',
  HELMET:    '/assets/accessory/helmet.png',
  HERO_CAPE: '/assets/accessory/hero_cape.png',

  CHEFS_HAT: '/assets/accessory/chefs_hat.png',
  MARTIAN_EARS: '/assets/accessory/martian_ears.png',
  GLASSES:   '/assets/accessory/glasses.png',
  MOUSTACHE: '/assets/accessory/moustache.png',
  PATCH:     '/assets/accessory/patch.png',
}

export function getAccessoryImageSrc(type: string): string | null {
  return ACCESSORY_IMAGES[type] ?? null
}