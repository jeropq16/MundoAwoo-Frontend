import { useState } from "react";
import { administracion } from "@/security/administracion";
import {
  ranurasPorTipo,
  type Tipo,
  type Ranura,
} from "@/domain/entities/mundo";
import { useCatalogo } from "../../catalogo/viewmodel/useCatalogo";
import { useOperacion } from "@/presentation/hooks/useOperacion";
export function useAdmin() {
  const vm = useCatalogo();
  const op = useOperacion();
  const [tipo, setTipo] = useState<Tipo>("Ropa");
  const categoria = vm.categorias.datos?.find((c) => c.id === vm.id);
  const crearCategoria = (d: FormData) =>
    op.ejecutar(async () => {
      const nueva = await administracion.categoria({
        nombre: String(d.get("nombre")),
        tipo,
      });
      vm.elegir(nueva.id);
      vm.categorias.recargar();
      op.avisar("Categoría creada.");
    });
  const crearItem = (d: FormData) =>
    op.ejecutar(async () => {
      await administracion.item({
        nombre: String(d.get("nombre")),
        categoriaId: vm.id,
        ranura: String(d.get("ranura")) as Ranura,
        recursoVisual: String(d.get("recursoVisual")),
      });
      vm.items.recargar();
      op.avisar("Pieza creada.");
    });
  const conceder = (d: FormData) =>
    op.ejecutar(async () => {
      const resultado = await administracion.conceder(
        String(d.get("item")),
        String(d.get("usuario")),
      );
      op.avisar("Pieza desbloqueada: " + resultado.item.nombre);
    });
  return {
    ...vm,
    tipo,
    setTipo,
    ocupado: op.ocupado,
    crearCategoria,
    crearItem,
    conceder,
    ranuras: categoria ? ranurasPorTipo[categoria.tipo] : [],
  };
}
