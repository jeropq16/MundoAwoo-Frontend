"use client";
import { useEffect, useRef, useState } from "react";
import type { Application } from "pixi.js";
import type { Equipado, Ranura } from "@/domain/entities/mundo";
import { useAlerta } from "../providers/Alertas";

const posiciones: Record<
  Exclude<Ranura, "Animacion">,
  [number, number, number, number]
> = {
  Cabeza: [40, 20, 53, 28],
  Ojos: [40, 33, 36, 10],
  Cuello: [39, 53, 33, 12],
  Torso: [37, 62, 41, 25],
  Piernas: [37, 77, 32, 10],
  Pies: [36, 83, 38, 9],
};

export function AvatarPixi({
  piezas,
  movimiento,
  pausa,
}: {
  piezas: Equipado[];
  movimiento: string;
  pausa: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const anim = useRef({ movimiento, pausa });
  const [listo, setListo] = useState(false);
  const avisar = useAlerta();
  useEffect(() => {
    anim.current = { movimiento, pausa };
  }, [movimiento, pausa]);
  useEffect(() => {
    let vivo = true;
    let instancia: Application | undefined;
    async function dibujar() {
      const { Application, Container, Sprite, Assets } =
        await import("pixi.js");
      if (!vivo) return;
      const app = new Application();
      await app.init({
        width: 160,
        height: 128,
        backgroundAlpha: 0,
        preference: "webgl",
        resolution: 2,
      });
      if (!vivo) {
        app.destroy(true, { children: true });
        return;
      }
      instancia = app;
      const lobo = new Container();
      lobo.pivot.set(40, 86);
      app.stage.addChild(lobo);
      const textura = await Assets.load("/lobo.svg");
      if (!vivo) return;
      const base = new Sprite(textura);
      base.setSize(80, 88);
      lobo.addChild(base);
      host.current?.appendChild(app.canvas);
      setListo(true);
      let tiempo = 0;
      app.ticker.maxFPS = 30;
      const reducido = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      app.ticker.add((ticker) => {
        if (!anim.current.pausa && !reducido) tiempo += ticker.deltaMS / 1000;
        const baile = anim.current.movimiento === "Bailar";
        const saludo = anim.current.movimiento === "Saludar";
        const onda = Math.sin(tiempo * (baile ? 6 : saludo ? 4 : 2));
        lobo.position.set(
          80 + (baile ? onda * 10 : 0),
          110 - Math.abs(onda) * (baile ? 8 : 1.2),
        );
        lobo.rotation = onda * (saludo ? 0.13 : baile ? 0.08 : 0.012);
      });
      for (const pieza of piezas) {
        if (pieza.ranura === "Animacion") continue;
        try {
          const url = new URL(pieza.recursoVisual, location.origin);
          if (!["http:", "https:"].includes(url.protocol)) throw new Error();
          const textura = await Assets.load(url.href);
          if (!vivo) return;
          const capa = new Sprite(textura);
          const [x, y, w, h] = posiciones[pieza.ranura];
          capa.anchor.set(0.5);
          capa.position.set(x, y);
          capa.setSize(w, h);
          lobo.addChild(capa);
        } catch {
          if (vivo) avisar("No se pudo mostrar la pieza " + pieza.nombre + ".");
        }
      }
    }
    dibujar().catch(() => {
      if (vivo) {
        setListo(false);
        avisar("El visor 2D no está disponible. Mostramos el avatar base.");
      }
    });
    return () => {
      vivo = false;
      instancia?.destroy(true, { children: true });
    };
  }, [piezas, avisar]);
  return (
    <div
      className="actor"
      role="img"
      aria-label={`Avatar en el bosque. ${movimiento}`}
      ref={host}
    >
      {!listo && <span className="wolfFallback" />}
    </div>
  );
}
