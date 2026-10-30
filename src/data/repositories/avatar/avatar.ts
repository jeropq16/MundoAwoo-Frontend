import { privada } from "@/security/sesion";
import type { Avatar } from "@/domain/entities/mundo";
export const avatarRepo = {
  obtener: () => privada<Avatar>("avatar"),
  color: (colorFondo: string) =>
    privada<Avatar>("avatar/color", "PUT", { colorFondo }),
  equipar: (id: string) =>
    privada<Avatar>(`avatar/items/${encodeURIComponent(id)}/equipar`, "POST"),
  quitar: (id: string) =>
    privada<void>(
      `avatar/items/${encodeURIComponent(id)}/desequipar`,
      "DELETE",
    ),
};
