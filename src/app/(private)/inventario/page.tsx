import { Inventario } from "@/presentation/pages/inventario/view/Inventario";
import { Privado } from "@/presentation/components/common/Privado";
export default function Page() {
  return (
    <Privado>
      <Inventario />
    </Privado>
  );
}
