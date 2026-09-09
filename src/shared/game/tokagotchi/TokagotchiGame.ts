import {
  createTokagotchiScene,
  type ITokagotchiScene,
} from "./TokagotchiScene";
import type { TokagotchiConfig } from "./types";
import type { EquippedAccessory } from "@/shared/domain/accessory";

/** Margen para que la captura se resuelva antes de darla por perdida. */
const SNAPSHOT_TIMEOUT_MS = 1500;

/**
 * Wrapper delgado sobre `Phaser.Game` que gestiona el ciclo de vida del juego
 * y expone únicamente los métodos necesarios para controlar el personaje desde React.
 *
 * - Registra y limpia el plugin DragonBones del cache global de Phaser para evitar
 *   el error `"Plugin key 'DragonBones' already in use"` en HMR / remonte del componente.
 * - Aplica el DPR del dispositivo internamente — el caller trabaja siempre en píxeles CSS.
 */
export class TokagotchiGame {
  private game: any;
  private scene: ITokagotchiScene;
  private dpr: number;

  /**
   * @param parent - Elemento HTML donde Phaser insertará el `<canvas>`.
   * @param cfg    - Configuración inicial del personaje (tamaño en px CSS, assets, animación…).
   */
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

  /** Cambia la animación activa sin recrear Phaser. */
  setAnimation(name: string) {
    this.scene.setAnimation(name);
  }

    /** Cambiar accesorios. */
  setAccessories(arrays?: EquippedAccessory[]) {
    this.scene.setAccessories(arrays);
  }

  /**
   * Redimensiona el canvas y reposiciona el armature.
   * Recibe dimensiones en px CSS; el DPR se aplica internamente.
   */
  resize(width: number, height: number, reverse: boolean) {
    const w = width * this.dpr;
    const h = height * this.dpr;
    this.game.scale?.resize?.(w, h);
    this.scene.updateLayout(w, h, reverse);
  }

  /**
   * Pausa o reanuda la animación DragonBones (`timeScale = 0 / 1`).
   * Seguro ante llamadas previas al boot de Phaser — delega el flag a la escena.
   */
  setPaused(paused: boolean) {
    this.scene.setPaused(paused);
  }

  /**
   * Captura el canvas como PNG con alfa: el Tokagotchi recortado, con sus
   * accesorios ya montados por DragonBones.
   *
   * Existe para poder reutilizar el personaje vestido FUERA de Phaser (la
   * moneda del volado), sin rehacer a mano el rigging de los accesorios ni
   * montar una segunda instancia del juego.
   *
   * Devuelve `null` —nunca lanza— si el armature todavía no está en escena, si
   * el renderer no soporta la captura o si no llega a resolverse. El caller
   * debe tener siempre una imagen de reserva.
   */
  snapshot(): Promise<string | null> {
    return new Promise((resolve) => {
      const renderer = this.game?.renderer;

      if (!renderer?.snapshot || !this.scene.isReady()) {
        resolve(null);
        return;
      }

      // La captura se resuelve en el siguiente pase de render. Si el juego no
      // está pintando (pestaña oculta, contexto perdido), nunca llegaría.
      let settled = false;
      const finish = (value: string | null) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };

      const timeout = window.setTimeout(() => finish(null), SNAPSHOT_TIMEOUT_MS);

      try {
        renderer.snapshot((image: HTMLImageElement) => {
          window.clearTimeout(timeout);
          finish(image?.src ?? null);
        });
      } catch {
        window.clearTimeout(timeout);
        finish(null);
      }
    });
  }

  /**
   * Destruye la instancia de Phaser y limpia el plugin del cache global.
   * Debe llamarse en el cleanup del `useEffect` de montaje.
   */
  destroy() {
    this.game?.destroy(true);
    (window as any).Phaser?.Plugins?.PluginCache?.remove?.("DragonBones");
  }
}
