import { useState, useEffect, useRef } from "react";
import type { Tokagotchi, AnimationTokagotchi } from "@/shared/types/tokagotchi";
import { userService } from "@/shared/services/userService";
//import { careService } from "@/shared/services/careService";
import { mapResponseToTokagotchi } from "@/shared/services/tokagotchiService";
import { CUIDADO_CONFIG, type AccionCuidado } from "../constants/cuidado";
import type { MisionResponse } from "@/shared/services/userService";
import { useToast } from "@/shared/hooks/useToast";

export type Floaters = Partial<Record<AccionCuidado, number>>;
export type Cooldowns = Record<AccionCuidado, number>;

export function useHome() {
  const [tokagotchi, setTokagotchi] = useState<Tokagotchi | null>(null);
  const [animation, setAnimation] = useState<AnimationTokagotchi>("idle");
  const [allTokas, setAllTokas] = useState<Tokagotchi[]>([]);
  const [username, setUsername] = useState("");
  const [tf, setTf] = useState(0);
  const [cp, setCp] = useState(0);
  const [misiones, setMisiones] = useState<MisionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [accionando, setAccionando] = useState<AccionCuidado | null>(null);
  const [cooldowns, setCooldowns] = useState<Cooldowns>({ feed: 0, play: 0, bathe: 0,});
  const [floaters, setFloaters] = useState<Floaters>({});
  const { show, toast } = useToast();

  const cooldownsRef = useRef(cooldowns);
  useEffect(() => {
    cooldownsRef.current = cooldowns;
  }, [cooldowns]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [me, misionesData] = await Promise.all([
          userService.getMe(),
          userService.getMisiones(),
        ]);
        setUsername(me.username);
        setTf(me.tf);
        if (me.tokagotchiActivo) {
          setTokagotchi(mapResponseToTokagotchi(me.tokagotchiActivo));
          setCp(me.tokagotchiActivo.cp ?? 0);
        }
        setAllTokas((me.tokagotchis ?? []).map(mapResponseToTokagotchi));
        setMisiones(misionesData.missions);
        console.log("Datos cargados:", { me, misionesData });
      } catch (err) {
        console.error("Error cargando home:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCooldowns((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const k of Object.keys(next) as AccionCuidado[]) {
          if (next[k] > 0) {
            next[k] = Math.max(0, next[k] - 1);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const ejecutarAccion = async (accion: AccionCuidado) => {
    if (!tokagotchi || accionando || cooldowns[accion] > 0) return;
    setAccionando(accion);

    try {
      /** 
      if (accion === "feed") await careService.feed(tokagotchi.id);
      else if (accion === "play") await careService.play(tokagotchi.id);
      else await careService.bathe(tokagotchi.id);
*/
      const cfg = CUIDADO_CONFIG.find((c) => c.key === accion)!;
      setCp((prev) => prev + cfg.cp);
      setCooldowns((prev) => ({ ...prev, [accion]: cfg.cooldownSeg }));

      // Animacion del Tokagotchi
      setAnimation(cfg.animation);
      setTimeout(() => setAnimation("idle"), 3000);

      // trigger floater animation
      const fid = Date.now();
      setFloaters((f) => ({ ...f, [accion]: fid }));
      setTimeout(
        () =>
          setFloaters((f) => {
            const n = { ...f };
            if (n[accion] === fid) delete n[accion];
            return n;
          }),
        1000,
      );

      show(`+${cfg.cp} CP por ${cfg.label.toLowerCase()}`, {
        variant: "celebrity",
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Accion fallida";
      show(msg, { variant: "danger" });
    } finally {
      setAccionando(null);
    }
  };

  const renameToka = async (newName: string) => {
    if (!tokagotchi) return;
    try {
      const updated = await userService.renameTokagotchi(
        Number(tokagotchi.id),
        newName,
      );
      setTokagotchi(updated);
      show("Nombre actualizado", { variant: "info" });
    } catch (err) {
      show("Error actualizando nombre", { variant: "danger" });
    }
  };

  return {
    tokagotchi,
    allTokas,
    username,
    tf,
    cp,
    misiones,
    loading,
    renameToka,
    ejecutarAccion,
    accionando,
    cooldowns,
    floaters,
    toast,
    animation,
  };
}
