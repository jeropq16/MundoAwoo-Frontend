import { aparienciaInicial } from "@/domain/entities/avatar3d";
import { useState } from "react";
import { useEstudio } from "../../avatar/viewmodel/useEstudio";
import { recurso3D } from "@/presentation/components/avatar3d/recursos3d";

export function useEstudio3D(usuario: string | null) {
  const estudio = useEstudio(usuario);
  const [camara, setCamara] = useState({ angulo: 0, revision: 0, detalle: false });
  const torso = estudio.avatar.itemsEquipados.find((p) => p.ranura === "Torso" && recurso3D(p));
  const chaquetaBase = estudio.avatar.personaje3D === "queen" ? estudio.avatar.chaquetaQueen : estudio.avatar.chaquetaGhetto;
  return {
    ...estudio,
    personaje: estudio.avatar.personaje3D,
    apariencia: (estudio.avatar.personaje3D === "queen" ? estudio.avatar.aparienciaQueen : estudio.avatar.aparienciaGhetto) ?? aparienciaInicial(estudio.avatar.personaje3D),
    chaquetaBase,
    torso,
    chaqueta: Boolean(torso) || chaquetaBase,
    camara,
    verRostro: () => setCamara((actual) => ({ angulo: 0, revision: actual.revision + 1, detalle: true })),
    girar: (angulo: number) => setCamara((actual) => ({ angulo, revision: actual.revision + 1, detalle: false })),
  };
}
