import { useCallback, useState } from "react";
import { catalogo } from "@/data/repositories/catalogo/catalogo";
import { useConsulta } from "@/presentation/hooks/useConsulta";
export function useCatalogo() {
  const categorias = useConsulta(catalogo.categorias);
  const [seleccion, elegir] = useState("");
  const id = seleccion || categorias.datos?.[0]?.id || "";
  const cargar = useCallback(
    () => (id ? catalogo.items(id) : Promise.resolve([])),
    [id],
  );
  const items = useConsulta(cargar);
  return { categorias, id, elegir, items };
}
