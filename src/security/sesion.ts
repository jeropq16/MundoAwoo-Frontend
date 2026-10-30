import { api, ApiError } from "@/data/api";
import type { Sesion } from "@/domain/entities/mundo";

const clave = "awoorld.sesion";
export function leerSesion(): Sesion | null {
  try {
    return JSON.parse(sessionStorage.getItem(clave) ?? "null");
  } catch {
    return null;
  }
}
export function guardarSesion(sesion: Sesion | null) {
  if (sesion) sessionStorage.setItem(clave, JSON.stringify(sesion));
  else sessionStorage.removeItem(clave);
  window.dispatchEvent(new Event(clave));
}
export function observarSesion(fn: () => void) {
  window.addEventListener(clave, fn);
  return () => window.removeEventListener(clave, fn);
}
let renovacion: Promise<Sesion> | null = null;
async function renovar(actual: Sesion) {
  if (!renovacion) {
    renovacion = api<Sesion>("autenticacion/refresh", "POST", {
      refreshToken: actual.refreshToken,
    })
      .then((nueva) => {
        if (leerSesion()?.refreshToken !== actual.refreshToken)
          throw new Error("La sesión cambió.");
        guardarSesion(nueva);
        return nueva;
      })
      .catch((error) => {
        if (
          error instanceof ApiError &&
          error.status === 401 &&
          leerSesion()?.refreshToken === actual.refreshToken
        )
          guardarSesion(null);
        throw error;
      })
      .finally(() => {
        renovacion = null;
      });
  }
  return renovacion;
}
export async function privada<T>(
  ruta: string,
  metodo = "GET",
  datos?: unknown,
): Promise<T> {
  const actual = leerSesion();
  if (!actual) throw new Error("Inicia sesión para continuar.");
  try {
    return await api<T>(ruta, metodo, datos, actual.token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    const ultima = leerSesion();
    if (!ultima || ultima.usuarioId !== actual.usuarioId)
      throw new Error("Tu sesión terminó.");
    const sesion =
      ultima.token === actual.token ? await renovar(ultima) : ultima;
    return api<T>(ruta, metodo, datos, sesion.token);
  }
}
export const autenticar = (
  correo: string,
  contrasena: string,
  nombreVisible?: string,
) =>
  api<Sesion>(
    "autenticacion/" + (nombreVisible === undefined ? "login" : "registro"),
    "POST",
    { correo, contrasena, nombreVisible },
  );
export async function cerrarSesion() {
  if (renovacion) await renovacion;
  const actual = leerSesion();
  if (!actual) return;
  try {
    await api<void>("autenticacion/cerrar-sesion", "POST", {
      refreshToken: actual.refreshToken,
    });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
  }
  guardarSesion(null);
}
