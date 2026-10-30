import { useRouter } from "next/navigation";
import { autenticar, guardarSesion } from "@/security/sesion";
import { useOperacion } from "@/presentation/hooks/useOperacion";
export function useAcceso(registro: boolean) {
  const router = useRouter();
  const { ejecutar, ocupado } = useOperacion();
  const enviar = (datos: FormData) =>
    ejecutar(async () => {
      const sesion = await autenticar(
        String(datos.get("correo")),
        String(datos.get("contrasena")),
        registro ? String(datos.get("nombreVisible")) : undefined,
      );
      guardarSesion(sesion);
      router.replace("/avatar");
    });
  return { enviar, ocupado };
}
