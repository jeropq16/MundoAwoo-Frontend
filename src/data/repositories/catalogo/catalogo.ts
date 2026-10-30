import { api } from "@/data/api";
import type { Categoria, Item } from "@/domain/entities/mundo";
export const catalogo = {
  categorias: () => api<Categoria[]>("catalogo/categorias"),
  items: (categoriaId: string) =>
    api<Item[]>("catalogo/items?" + new URLSearchParams({ categoriaId })),
};
