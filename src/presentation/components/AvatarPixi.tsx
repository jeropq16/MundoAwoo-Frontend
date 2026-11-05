"use client";
import { useEffect, useRef, useState } from "react";
import type { Application, Texture } from "pixi.js";
import type { Equipado, Ranura } from "@/domain/entities/mundo";
import { useAlerta } from "../providers/Alertas";
import { esChaquetaGhetto, frameRyan, spriteRyan, type VistaAvatar } from "./avatarApariencia";

// Coordinates for the human avatar within the existing 160 × 128 scene.
const posiciones: Record<Exclude<Ranura, "Animacion">, [number, number, number, number]> = {
  Cabeza: [40, 7, 17, 10],
  Ojos: [40, 13, 11, 3.7],
  Cuello: [40, 24, 16, 7],
  Torso: [40, 43, 43, 40],
  Piernas: [40, 80, 31, 42],
  Pies: [40, 103, 31, 9],
};

type Props = {
  piezas: Equipado[];
  movimiento: string;
  pausa: boolean;
  vista: VistaAvatar;
};

export function AvatarPixi(props: Props) {
  // Reset the renderer's loading state when the outfit/view changes. Motion and
  // pause update the existing ticker without rebuilding the WebGL application.
  const identidad = JSON.stringify([props.vista, props.piezas]);
  return <VisorRyan key={identidad} {...props} />;
}

function VisorRyan({ piezas, movimiento, pausa, vista }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const anim = useRef({ movimiento, pausa });
  const [listo, setListo] = useState(false);
  const avisar = useAlerta();
  const frame = frameRyan(piezas, vista);

  useEffect(() => { anim.current = { movimiento, pausa }; }, [movimiento, pausa]);

  useEffect(() => {
    let vivo = true;
    let instancia: Application | undefined;
    let texturaFrame: Texture | undefined;
    async function dibujar() {
      const { Application, Container, Sprite, Assets, Texture, Rectangle } = await import("pixi.js");
      if (!vivo) return;
      const app = new Application();
      await app.init({ width: 160, height: 128, backgroundAlpha: 0, preference: "webgl", resolution: 4, antialias: true });
      if (!vivo) { app.destroy(true, { children: true }); return; }
      instancia = app;
      const personaje = new Container();
      personaje.pivot.set(40, 108);
      personaje.position.set(80, 110);
      app.stage.addChild(personaje);
      const hoja = await Assets.load<Texture>(spriteRyan);
      if (!vivo) return;
      const ancho = hoja.width / 4;
      texturaFrame = new Texture({ source: hoja.source, frame: new Rectangle(frame * ancho, 0, ancho, hoja.height) });
      const base = new Sprite(texturaFrame);
      base.position.set(13, 0);
      base.setSize(54, 108);
      personaje.addChild(base);

      for (const pieza of piezas) {
        if (pieza.ranura === "Animacion" || esChaquetaGhetto(pieza)) continue;
        // Face accessories don't appear through the back of the head.
        if (vista === "espalda" && ["Ojos", "Cuello"].includes(pieza.ranura)) continue;
        try {
          const recurso = vista === "espalda" && pieza.recursoVisual === "/piezas/gorra.svg"
            ? "/piezas/gorra-espalda.svg" : pieza.recursoVisual;
          const url = new URL(recurso, location.origin);
          if (!["http:", "https:"].includes(url.protocol)) throw new Error();
          const textura = await Assets.load<Texture>(url.href);
          if (!vivo) return;
          const capa = new Sprite(textura);
          const [x, y, w, h] = posiciones[pieza.ranura];
          capa.anchor.set(0.5);
          capa.position.set(x, y);
          capa.setSize(w, h);
          personaje.addChild(capa);
        } catch {
          if (vivo) avisar("No se pudo mostrar la pieza " + pieza.nombre + ".");
        }
      }
      if (!vivo) return;
      host.current?.appendChild(app.canvas);
      setListo(true);
      let tiempo = 0;
      app.ticker.maxFPS = 30;
      const preferencia = window.matchMedia("(prefers-reduced-motion: reduce)");
      app.ticker.add((ticker) => {
        if (anim.current.pausa || preferencia.matches) return;
        tiempo += ticker.deltaMS / 1000;
        const baile = anim.current.movimiento === "Bailar";
        const saludo = anim.current.movimiento === "Saludar";
        const onda = Math.sin(tiempo * (baile ? 6 : saludo ? 4 : 2));
        personaje.position.set(80 + (baile ? onda * 5 : 0), 110 - Math.abs(onda) * (baile ? 4 : saludo ? 1.5 : .6));
        personaje.rotation = onda * (saludo ? .045 : baile ? .05 : .004);
      });
    }
    dibujar().catch(() => {
      if (vivo) avisar("El visor animado no está disponible. Mostramos la vista estática de Ryan.");
    });
    return () => {
      vivo = false;
      instancia?.destroy(true, { children: true });
      texturaFrame?.destroy();
    };
  }, [piezas, vista, frame, avisar]);

  return (
    <div className="actor" role="img" aria-label={`Ryan Castro animado, de ${vista}, ${frame % 2 ? "con chaqueta Ghetto" : "sin chaqueta"}. ${pausa ? "En pausa" : movimiento}`} ref={host}>
      {!listo && <span className="avatarFallback" style={{ backgroundPosition: `${frame * 100 / 3}% 0` }} />}
    </div>
  );
}
