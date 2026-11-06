import { useEffect, useMemo } from "react";
import { CanvasTexture, CatmullRomCurve3, Vector3, Shape } from "three";
import type { Apariencia3D, Personaje3D } from "@/domain/entities/avatar3d";
import { Volumen } from "./Formas";

function Trenza({ x, color }: { x: number; color: string }) {
  const curva = useMemo(() => new CatmullRomCurve3([
    new Vector3(x, .13, .155), new Vector3(x, .235, .08),
    new Vector3(x, .255, -.02), new Vector3(x, .22, -.13), new Vector3(x, .12, -.19),
  ]), [x]);
  return <mesh castShadow><tubeGeometry args={[curva, 16, .013, 6, false]} /><meshStandardMaterial color={color} roughness={.85} /></mesh>;
}

function CapaCorta({ color }: { color: string }) {
  return <mesh scale={[.214, .25, .194]} castShadow><sphereGeometry args={[1, 32, 20, 0, Math.PI * 2, 0, Math.PI * .4]} /><meshStandardMaterial color={color} roughness={.85} /></mesh>;
}
function Cresta({ color }: { color: string }) {
  const perfil = useMemo(() => {
    const forma = new Shape();
    forma.moveTo(-.18, .16);
    forma.bezierCurveTo(-.19, .31, .02, .36, .14, .30);
    forma.quadraticCurveTo(.18, .25, .18, .16);
    forma.quadraticCurveTo(0, .24, -.18, .16);
    return forma;
  }, []);
  return <mesh rotation={[0, Math.PI / 2, 0]} position={[-.035, 0, 0]} castShadow><extrudeGeometry args={[perfil, { depth: .07, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .01, bevelThickness: .01 }]} /><meshStandardMaterial color={color} roughness={.85} /></mesh>;
}

export function Pelo3D({ estilo, personaje, color }: { estilo: Apariencia3D["pelo"]; personaje: Personaje3D; color: string }) {
  if (estilo === "rapado") return null;
  if (estilo === "trenzas") return <group>
    <Volumen posicion={[0, .17, -.035]} escala={[.20, .10, .175]} color={color} />
    {[-.15, -.10, -.05, 0, .05, .10, .15].map((x) => <Trenza key={x} x={x} color={color} />)}
    {[-1, 1].map((lado) => <Volumen key={lado} posicion={[lado * .12, -.02, -.195]} escala={[.023, .15, .025]} color={color} />)}
  </group>;
  if (estilo === "cresta") return <group>
    <CapaCorta color={color} />
    <Cresta color={color} />
  </group>;
  if (estilo === "fade") return <group>
    <CapaCorta color={color} />
    <Volumen posicion={[0, .235, .015]} escala={[.178, .085, .145]} color={color} />
  </group>;
  return <group>
    <Volumen posicion={[0, .14, -.035]} escala={[.215, .135, .19]} color={color} />
    {personaje === "queen" ? <group>
      <Volumen posicion={[0, .1, -.14]} escala={[.21, .21, .11]} color={color} />
      {[-1, 1].map((lado) => <group key={lado}>
        <Volumen posicion={[lado * .17, .2, -.05]} escala={[.105, .12, .105]} color={color} />
        <Volumen posicion={[lado * .18, -.1, -.12]} escala={[.055, .25, .065]} color={color} />
      </group>)}
    </group> : <Volumen posicion={[0, .215, -.015]} escala={[.2, .085, .17]} color={color} />}
  </group>;
}

function Bigote({ color }: { color: string }) {
  return <group>{[-1, 1].map((lado) => <Volumen key={lado} posicion={[lado * .025, -.078, .188]} escala={[.032, .012, .018]} color={color} />)}</group>;
}
export function Barba3D({ estilo, personaje, color }: { estilo: Apariencia3D["barba"]; personaje: Personaje3D; color: string }) {
  if (estilo === "afeitado" || (estilo === "original" && personaje === "queen")) return null;
  if (estilo === "bigote") return <Bigote color={color} />;
  if (estilo === "candado") return <group><Bigote color={color} /><Volumen posicion={[0, -.155, .155]} escala={[.05, .068, .039]} color={color} />{[-1, 1].map((lado) => <Volumen key={lado} posicion={[lado * .042, -.113, .171]} escala={[.011, .034, .016]} color={color} />)}</group>;
  if (estilo === "original") return <Volumen posicion={[0, -.135, .12]} escala={[.115, .07, .065]} color={color} />;
  return <group>
    <Volumen posicion={[0, -.15, .12]} escala={[.13, .085, .08]} color={color} />
    {[-1, 1].map((lado) => <Volumen key={lado} posicion={[lado * .11, -.09, .115]} escala={[.044, .084, .055]} color={color} />)}
    <Bigote color={color} />
  </group>;
}

// Transparent ink maps are projected through the same UVs as the skin meshes.
// Keeping the overlay inside each bone prevents tattoos from drifting in motion.
export function useTinta(estilo: Apariencia3D["tatuajes"]) {
  const textura = useMemo(() => {
    if (estilo === "ninguno") return null;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.strokeStyle = ctx.fillStyle = "#11151c";
    ctx.lineCap = ctx.lineJoin = "round";
    if (estilo === "estrellas") {
      for (const x of [64, 192, 320, 448]) for (const y of [128, 256, 384]) {
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const angulo = -Math.PI / 2 + i * Math.PI / 5;
          const radio = i % 2 ? 12 : 29;
          const px = x + Math.cos(angulo) * radio, py = y + Math.sin(angulo) * radio;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill();
      }
    } else if (estilo === "geometrico") {
      ctx.lineWidth = 7;
      for (const x of [64, 192, 320, 448]) for (const y of [144, 256, 368]) {
        ctx.beginPath(); ctx.moveTo(x, y - 38); ctx.lineTo(x + 33, y); ctx.lineTo(x, y + 38); ctx.lineTo(x - 33, y); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 25, y); ctx.lineTo(x + 25, y); ctx.moveTo(x, y - 29); ctx.lineTo(x, y + 29); ctx.stroke();
      }
    } else {
      ctx.fillRect(0, 126, 512, 22); ctx.fillRect(0, 358, 512, 22);
      ctx.lineWidth = 13;
      for (let x = -32; x < 544; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, 172); ctx.lineTo(x + 54, 256); ctx.lineTo(x, 340); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 22, 192); ctx.lineTo(x + 58, 256); ctx.lineTo(x + 22, 320); ctx.closePath(); ctx.fill();
      }
    }
    const tinta = new CanvasTexture(canvas);
    tinta.anisotropy = 4;
    return tinta;
  }, [estilo]);
  useEffect(() => () => textura?.dispose(), [textura]);
  return textura;
}
