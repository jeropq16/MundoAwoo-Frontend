import { inventario } from "@/data/repositories/inventario/inventario";
import { useConsulta } from "@/presentation/hooks/useConsulta";
export const useInventario = () => useConsulta(inventario);
