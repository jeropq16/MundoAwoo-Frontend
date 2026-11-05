import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";

// Cuerpo y ropa comparten articulaciones. La mezcla suaviza el inicio y el final.
export function useBaile(bailando: boolean) {
  const raiz = useRef<Group>(null);
  const tiempo = useRef(0);
  const mezcla = useRef(0);
  useFrame((_, delta) => {
    const cuerpo = raiz.current;
    if (!cuerpo) return;
    const paso = Math.min(delta, 0.05);
    mezcla.current = MathUtils.damp(mezcla.current, bailando ? 1 : 0, 6, paso);
    if (mezcla.current < 0.001 && !bailando) mezcla.current = 0;
    if (bailando) tiempo.current += paso * 5.6;
    const t = tiempo.current;
    const peso = mezcla.current;
    cuerpo.position.y = Math.abs(Math.sin(t)) * 0.055 * peso;
    cuerpo.rotation.y = Math.sin(t * 0.5) * 0.25 * peso;
    cuerpo.rotation.z = Math.sin(t) * 0.055 * peso;
    for (const lado of [-1, 1]) {
      const brazo = cuerpo.getObjectByName("brazo" + lado);
      const codo = cuerpo.getObjectByName("codo" + lado);
      const pierna = cuerpo.getObjectByName("pierna" + lado);
      const rodilla = cuerpo.getObjectByName("rodilla" + lado);
      if (brazo) {
        brazo.rotation.z =
          lado * (0.14 + (0.45 + Math.sin(t + lado) * 0.3) * peso);
        brazo.rotation.x = Math.sin(t + lado) * 0.4 * peso;
      }
      if (codo)
        codo.rotation.x = -(0.15 + (0.9 + Math.cos(t + lado) * 0.6) * peso);
      if (pierna)
        pierna.rotation.x = Math.sin(t + (lado * Math.PI) / 2) * 0.22 * peso;
      if (rodilla)
        rodilla.rotation.x =
          Math.max(0, Math.cos(t + (lado * Math.PI) / 2)) * 0.4 * peso;
    }
  });
  return raiz;
}
