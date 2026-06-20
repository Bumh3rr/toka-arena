import manifestJson from "@/assets/dragonbones/accessories.manifest.json";

interface RenderBinding {
  displayIndex: number;
}

const MANIFEST = manifestJson as Record<string, RenderBinding>;

export function getRenderBinding(code: string): RenderBinding | null {
  return MANIFEST[code] ?? null;
}
