import type {
  PassReward,
  RewardStatus,
  AccessoryType,
  EggRarity,
} from "../pass.types";

const ACCESSORY_LABELS: Record<AccessoryType, string> = {
  HAT: "Sombrero de Aventurero",
  GLASSES: "Lentes",
  MOUSTACHE: "Bigote Elegante",
  PATCH: "Parche de Pirata",
  CHEFS_HAT: "Gorro de Chef",
  HELMET: "Casco",
  HERO_CAPE: "Capa de Héroe",
  AURORA_CAPE: "Capa Aurora",
};

const EGG_LABELS: Record<EggRarity, string> = {
  COMMON: "Huevo Común",
  RARE: "Huevo Raro",
};

export function getRewardTitle(r: PassReward): string {
  switch (r.type) {
    case "TOKA_FEED":
      return `${r.amount ?? 0} Toka Feed`;
    case "ACCESSORY":
      return r.accessoryType ? ACCESSORY_LABELS[r.accessoryType] : "Accesorio";
    case "EGG":
      return r.eggRarity ? EGG_LABELS[r.eggRarity] : "Huevo";
  }
}

export function getRewardSubtitle(r: PassReward): string {
  const category =
    r.type === "TOKA_FEED" ? "Moneda" : r.type === "ACCESSORY" ? "Accesorio" : "Huevo";
  return `${category} · ${r.refPrice} TF`;
}

export type GlyphDescriptor =
  | { kind: "image"; src: string; alt: string }
  | { kind: "accessory" };

export function getRewardGlyph(r: PassReward): GlyphDescriptor {
  switch (r.type) {
    case "TOKA_FEED":
      return { kind: "image", src: "/assets/ui/tf/tf.svg", alt: "Toka Feed" };
    case "EGG":
      return { kind: "image", src: "/assets/ui/egg/egg.png", alt: "Huevo" };
    case "ACCESSORY":
      return { kind: "accessory" };
  }
}

export function getRewardStatus(
  r: PassReward,
  ctx: { level: number; isPremium: boolean },
): RewardStatus {
  if (r.lane === "PREMIUM" && !ctx.isPremium) return "locked";
  return ctx.level >= r.level ? "claimable" : "locked";
}
