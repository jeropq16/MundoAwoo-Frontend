import { useState } from "react";
import type { Personaje3D } from "@/domain/entities/avatar3d";

export function useEstudio3D() {
  const [personaje, setPersonaje] = useState<Personaje3D>("ghetto");
  const [prendas, setPrendas] = useState({ ghetto: false, queen: false });
  const [bailando, setBailando] = useState(false);
  const [camara, setCamara] = useState({ angulo: 0, revision: 0 });
  function girar(angulo: number) {
    setCamara((actual) => ({ angulo, revision: actual.revision + 1 }));
  }
  function cambiarPersonaje(valor: Personaje3D) {
    setPersonaje(valor);
    setBailando(false);
  }
  return {
    personaje,
    cambiarPersonaje,
    chaqueta: prendas[personaje],
    bailando,
    alternarPrenda: () =>
      setPrendas((actual) => ({ ...actual, [personaje]: !actual[personaje] })),
    alternarBaile: () => setBailando((actual) => !actual),
    camara,
    girar,
  };
}
