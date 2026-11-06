import { useState } from "react";
import { useEstudio } from "../../avatar/viewmodel/useEstudio";
import { recurso3D } from "@/presentation/components/avatar3d/recursos3d";

export function useEstudio3D(usuario: string | null) {
  const estudio = useEstudio(usuario);
  const [camara, setCamara] = useState({ angulo: 0, revision: 0 });
  const torso = estudio.avatar.itemsEquipados.find((p) => p.ranura === "Torso" && recurso3D(p));
  const chaquetaBase = estudio.avatar.personaje3D === "queen" ? estudio.avatar.chaquetaQueen : estudio.avatar.chaquetaGhetto;
  return {
    ...estudio,
    personaje: estudio.avatar.personaje3D,
    chaquetaBase,
    torso,
    chaqueta: Boolean(torso) || chaquetaBase,
    camara,
    girar: (angulo: number) => setCamara((actual) => ({ angulo, revision: actual.revision + 1 })),
  };
}
