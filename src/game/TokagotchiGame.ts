import {
  createTokagotchiScene,
  type ITokagotchiScene,
} from "./TokagotchiScene";
import type { TokagotchiConfig } from "./types";

export class TokagotchiGame {
  private game: any;
  private scene: ITokagotchiScene;
  private dpr: number;

  constructor(parent: HTMLElement, cfg: TokagotchiConfig) {
    const Phaser = (window as any).Phaser;
    const db = (window as any).dragonBones;

    Phaser.Plugins?.PluginCache?.remove?.("DragonBones");

    this.dpr = window.devicePixelRatio || 1;
    cfg.width = cfg.width * this.dpr;
    cfg.height = cfg.height * this.dpr;

    this.scene = createTokagotchiScene(cfg);
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      width: cfg.width,
      height: cfg.height,
      transparent: true,
      parent,
      scale: {
        mode: Phaser.Scale.NONE,
        width: cfg.width,
        height: cfg.height,
        zoom: 1 / this.dpr,
      },
      plugins: {
        scene: [
          {
            key: "DragonBones",
            plugin: db.phaser.plugin.DragonBonesScenePlugin,
            mapping: "dragonbone",
          },
        ],
      },
      scene: [this.scene],
    });
  }

  setAnimation(name: string) {
    this.scene.setAnimation(name);
  }
  setAccesorioCabeza(index: number) {
    this.scene.setAccesorioCabeza(index);
  }
  setAccesorioCuerpo(index: number) {
    this.scene.setAccesorioCuerpo(index);
  }

  resize(width: number, height: number, reverse: boolean) {
    const w = width * this.dpr;
    const h = height * this.dpr;
    this.game.scale?.resize?.(w, h);
    this.scene.updateLayout(w, h, reverse);
  }

  destroy() {
    this.game?.destroy(true);
    (window as any).Phaser?.Plugins?.PluginCache?.remove?.("DragonBones");
  }
}
