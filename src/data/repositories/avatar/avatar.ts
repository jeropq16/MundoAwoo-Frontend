import { privada } from "@/security/sesion";
import type { Estilo3D, Apariencia3D, Personaje3D } from "@/domain/entities/avatar3d";
import type { Avatar } from "@/domain/entities/mundo";
export const avatarRepo = {
  obtener: () => privada<Avatar>("avatar"),
  color: (colorFondo: string) =>
    privada<Avatar>("avatar/color", "PUT", { colorFondo }),
  estilo3D: (estilo: Estilo3D) => privada<Avatar>("avatar/estilo3d", "PUT", estilo),
  apariencia3D: (personaje3D: Personaje3D, apariencia: Apariencia3D) =>
    privada<Avatar>("avatar/apariencia3d", "PUT", { personaje3D, ...apariencia }),
  equipar: (id: string) =>
    privada<Avatar>(`avatar/items/${encodeURIComponent(id)}/equipar`, "POST"),
  quitar: (id: string) =>
    privada<void>(
      `avatar/items/${encodeURIComponent(id)}/desequipar`,
      "DELETE",
    ),
};
