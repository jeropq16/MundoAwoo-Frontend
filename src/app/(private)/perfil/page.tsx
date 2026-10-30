import { Perfil } from "@/presentation/pages/perfil/view/Perfil";
import { Privado } from "@/presentation/components/common/Privado";
export default function Page() {
  return (
    <Privado>
      <Perfil />
    </Privado>
  );
}
