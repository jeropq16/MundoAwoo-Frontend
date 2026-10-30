import { privada } from "./sesion";
import type { Categoria, Item, Desbloqueo } from "@/domain/entities/mundo";
export const administracion = {
  categoria: (datos: Omit<Categoria, "id">) =>
    privada<Categoria>("admin/catalogo/categorias", "POST", datos),
  item: (datos: Omit<Item, "id">) =>
    privada<Item>("admin/catalogo/items", "POST", datos),
  conceder: (itemId: string, usuarioId: string) =>
    privada<Desbloqueo>(
      `inventario/items/${encodeURIComponent(itemId)}/desbloquear`,
      "POST",
      { usuarioId },
    ),
};
