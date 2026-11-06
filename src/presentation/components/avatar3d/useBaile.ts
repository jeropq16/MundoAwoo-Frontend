import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import type { Movimiento3D } from "@/domain/entities/avatar3d";

export function useBaile(movimiento: Movimiento3D, pausa: boolean) {
  const raiz = useRef<Group>(null);
  const tiempo = useRef(0);
  const baile = useRef(0);
  const saludo = useRef(0);
  const reducido = useRef(false);
  useEffect(() => {
    const preferencia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const actualizar = () => { reducido.current = preferencia.matches; };
    actualizar();
    preferencia.addEventListener("change", actualizar);
    return () => preferencia.removeEventListener("change", actualizar);
  }, []);
  useFrame((_, delta) => {
    const cuerpo = raiz.current;
    if (!cuerpo || pausa || reducido.current) return;
    const paso = Math.min(delta, .05);
    baile.current = MathUtils.damp(baile.current, movimiento === "Bailar" ? 1 : 0, 6, paso);
    saludo.current = MathUtils.damp(saludo.current, movimiento === "Saludar" ? 1 : 0, 6, paso);
    tiempo.current += paso * 5.6;
    const t = tiempo.current;
    const peso = baile.current;
    const gesto = saludo.current;
    cuerpo.position.y = Math.abs(Math.sin(t)) * .055 * peso;
    cuerpo.rotation.y = Math.sin(t * .5) * .25 * peso;
    cuerpo.rotation.z = Math.sin(t) * .055 * peso;
    for (const lado of [-1, 1]) {
      const brazo = cuerpo.getObjectByName("brazo" + lado);
      const codo = cuerpo.getObjectByName("codo" + lado);
      const pierna = cuerpo.getObjectByName("pierna" + lado);
      const rodilla = cuerpo.getObjectByName("rodilla" + lado);
      if (brazo) {
        brazo.rotation.z = lado * (.14 + (.45 + Math.sin(t + lado) * .3) * peso) + (lado === 1 ? (2.15 + Math.sin(t * 1.5) * .18) * gesto : 0);
        brazo.rotation.x = Math.sin(t + lado) * .4 * peso;
      }
      if (codo) codo.rotation.x = -(.15 + (.9 + Math.cos(t + lado) * .6) * peso + (lado === 1 ? .5 * gesto : 0));
      if (pierna) pierna.rotation.x = Math.sin(t + lado * Math.PI / 2) * .22 * peso;
      if (rodilla) rodilla.rotation.x = Math.max(0, Math.cos(t + lado * Math.PI / 2)) * .4 * peso;
    }
  });
  return raiz;
}
