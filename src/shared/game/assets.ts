import type { Assets, Species } from "../domain/tokagotchi";

const TOKAGOTCHI_ANIMATION_BASE = "/assets/tokagotchis/animations";
const TOKAGOTCHI_IMAGE_BASE = "/assets/tokagotchis/png";
const ACCESSORY_IMAGE_PNG_BASE = "/assets/tokagotchis/accessory/png";
const ACCESSORY_IMAGE_SVG_BASE = "/assets/tokagotchis/accessory/svg";

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

const ACCESSORY_IMAGES_PNG = {
  CROWN: `${ACCESSORY_IMAGE_PNG_BASE}/crown.png`,
  HAT: `${ACCESSORY_IMAGE_PNG_BASE}/hat.png`,
  HELMET: `${ACCESSORY_IMAGE_PNG_BASE}/helmet.png`,
  HERO_CAPE: `${ACCESSORY_IMAGE_PNG_BASE}/hero_cape.png`,
  CHEFS_HAT: `${ACCESSORY_IMAGE_PNG_BASE}/chefs_hat.png`,
  MARTIAN_EARS: `${ACCESSORY_IMAGE_PNG_BASE}/martian_ears.png`,
  GLASSES: `${ACCESSORY_IMAGE_PNG_BASE}/glasses.png`,
  MOUSTACHE: `${ACCESSORY_IMAGE_PNG_BASE}/moustache.png`,
  PATCH: `${ACCESSORY_IMAGE_PNG_BASE}/patch.png`,
} as const;

const ACCESSORY_IMAGES_SVG = {
  CROWN: `${ACCESSORY_IMAGE_SVG_BASE}/crown.svg`,
  HAT: `${ACCESSORY_IMAGE_SVG_BASE}/hat.svg`,
  HELMET: `${ACCESSORY_IMAGE_SVG_BASE}/helmet.svg`,
  HERO_CAPE: `${ACCESSORY_IMAGE_SVG_BASE}/hero_cape.svg`,
  CHEFS_HAT: `${ACCESSORY_IMAGE_SVG_BASE}/chefs_hat.svg`,
  MARTIAN_EARS: `${ACCESSORY_IMAGE_SVG_BASE}/martian_ears.svg`,
  GLASSES: `${ACCESSORY_IMAGE_SVG_BASE}/glasses.svg`,
  MOUSTACHE: `${ACCESSORY_IMAGE_SVG_BASE}/moustache.svg`,
  PATCH: `${ACCESSORY_IMAGE_SVG_BASE}/patch.svg`,
} as const;

type AccessoryImagePngKey = keyof typeof ACCESSORY_IMAGES_PNG;
type AccessoryImageSVGKey = keyof typeof ACCESSORY_IMAGES_SVG;

export function getSpeciesAssets(species: Species): Assets {
  return SPECIES_ASSETS[species];
}

export function getSpeciesImageSrc(species: Species): string {
  return SPECIES_IMAGE_SOURCES[species];
}

export function getAccessoryImagePngSrc(type: string): string | null {
  if (type in ACCESSORY_IMAGES_PNG) {
    return ACCESSORY_IMAGES_PNG[type as AccessoryImagePngKey];
  }

  return null;
}

export function getAccessoryImageSvgSrc(type: string): string | null {
  if (type in ACCESSORY_IMAGES_SVG) {
    return ACCESSORY_IMAGES_SVG[type as AccessoryImageSVGKey];
  }

  return null;
}