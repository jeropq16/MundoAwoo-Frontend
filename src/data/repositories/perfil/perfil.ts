import { privada } from "@/security/sesion";
import type { Perfil } from "@/domain/entities/mundo";
export const perfilRepo = {
  obtener: () => privada<Perfil>("perfil"),
  guardar: (nombreVisible: string, biografia: string) =>
    privada<Perfil>("perfil", "PUT", { nombreVisible, biografia }),
};
