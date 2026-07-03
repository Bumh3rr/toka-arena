import type { Assets, Species } from "../domain/tokagotchi";

const TOKAGOTCHI_ANIMATION_BASE = "/assets/tokagotchis/animations";
const TOKAGOTCHI_IMAGE_BASE = "/assets/tokagotchis/png";
const ACCESSORY_IMAGE_BASE = "/assets/tokagotchis/accessory";

const SPECIES_ASSETS = {
  TOFU: {
    armatureKey: "tofu",
    texPng: `${TOKAGOTCHI_ANIMATION_BASE}/tofu/tofu_tex.png`,
    texJson: `${TOKAGOTCHI_ANIMATION_BASE}/tofu/tofu_tex.json`,
    skeJson: `${TOKAGOTCHI_ANIMATION_BASE}/tofu/tofu_ske.json`,
  },
  MOCHI: {
    armatureKey: "mochi",
    texPng: `${TOKAGOTCHI_ANIMATION_BASE}/mochi/mochi_tex.png`,
    texJson: `${TOKAGOTCHI_ANIMATION_BASE}/mochi/mochi_tex.json`,
    skeJson: `${TOKAGOTCHI_ANIMATION_BASE}/mochi/mochi_ske.json`,
  },
  HANA: {
    armatureKey: "hana",
    texPng: `${TOKAGOTCHI_ANIMATION_BASE}/hana/hana_tex.png`,
    texJson: `${TOKAGOTCHI_ANIMATION_BASE}/hana/hana_tex.json`,
    skeJson: `${TOKAGOTCHI_ANIMATION_BASE}/hana/hana_ske.json`,
  },
} satisfies Record<Species, Assets>;

const SPECIES_IMAGE_SOURCES = {
  TOFU: `${TOKAGOTCHI_IMAGE_BASE}/tofu.png`,
  MOCHI: `${TOKAGOTCHI_IMAGE_BASE}/mochi.png`,
  HANA: `${TOKAGOTCHI_IMAGE_BASE}/hana.png`,
} satisfies Record<Species, string>;

const ACCESSORY_IMAGES = {
  CROWN: `${ACCESSORY_IMAGE_BASE}/crown.png`,
  HAT: `${ACCESSORY_IMAGE_BASE}/hat.png`,
  HELMET: `${ACCESSORY_IMAGE_BASE}/helmet.png`,
  HERO_CAPE: `${ACCESSORY_IMAGE_BASE}/hero_cape.png`,
  CHEFS_HAT: `${ACCESSORY_IMAGE_BASE}/chefs_hat.png`,
  MARTIAN_EARS: `${ACCESSORY_IMAGE_BASE}/martian_ears.png`,
  GLASSES: `${ACCESSORY_IMAGE_BASE}/glasses.png`,
  MOUSTACHE: `${ACCESSORY_IMAGE_BASE}/moustache.png`,
  PATCH: `${ACCESSORY_IMAGE_BASE}/patch.png`,
} as const;

type AccessoryImageKey = keyof typeof ACCESSORY_IMAGES;

export function getSpeciesAssets(species: Species): Assets {
  return SPECIES_ASSETS[species];
}

export function getSpeciesImageSrc(species: Species): string {
  return SPECIES_IMAGE_SOURCES[species];
}

export function getAccessoryImageSrc(type: string): string | null {
  if (type in ACCESSORY_IMAGES) {
    return ACCESSORY_IMAGES[type as AccessoryImageKey];
  }

  return null;
}