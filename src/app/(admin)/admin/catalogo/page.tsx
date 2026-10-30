import { Admin } from "@/presentation/pages/admin-catalogo/view/Admin";
import { Privado } from "@/presentation/components/common/Privado";
export default function Page() {
  return (
    <Privado>
      <Admin />
    </Privado>
  );
}
