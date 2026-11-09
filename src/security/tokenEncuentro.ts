import { leerSesion, privada } from "./sesion";

// Reutiliza la renovación coordinada de la sesión antes de conectar el chat.
export async function tokenEncuentro() {
  const sesion = leerSesion();
  if (!sesion) throw new Error("Inicia sesión para entrar al encuentro.");
  if (Date.parse(sesion.expiraEnUtc) <= Date.now() + 30_000) {
    await privada("perfil");
  }
  return leerSesion()?.token ?? "";
}
