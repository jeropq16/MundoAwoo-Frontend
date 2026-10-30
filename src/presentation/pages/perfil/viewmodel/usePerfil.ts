import { cerrarSesion } from "@/security/sesion";
import { perfilRepo } from "@/data/repositories/perfil/perfil";
import { useConsulta } from "@/presentation/hooks/useConsulta";
import { useOperacion } from "@/presentation/hooks/useOperacion";
import { useRouter } from "next/navigation";
export function usePerfil() {
  const consulta = useConsulta(perfilRepo.obtener);
  const { ocupado, ejecutar, avisar } = useOperacion();
  const router = useRouter();
  const guardar = (datos: FormData) =>
    ejecutar(async () => {
      await perfilRepo.guardar(
        String(datos.get("nombreVisible")),
        String(datos.get("biografia")),
      );
      consulta.recargar();
      avisar("Perfil guardado.");
    });
  const salir = () =>
    ejecutar(async () => {
      await cerrarSesion();
      router.replace("/");
    });
  return { ...consulta, guardar, salir, ocupado };
}
