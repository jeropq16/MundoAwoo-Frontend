import type { RetornoEncuentro } from "@/domain/entities/encuentro";

// Privado por cuenta y pestaña: la clave nunca se comparte junto al código de invitación.
const clave = (usuario: string) => `awoorld.encuentro.${usuario}`;
export function leerRetornoEncuentro(usuario: string): RetornoEncuentro | null {
  try {
    const dato = JSON.parse(sessionStorage.getItem(clave(usuario)) ?? "null");
    return dato && /^[A-F0-9]{12}$/.test(dato.codigo) && /^[A-F0-9]{64}$/.test(dato.tokenReconexion)
      ? { codigo: dato.codigo, tokenReconexion: dato.tokenReconexion } : null;
  } catch { return null; }
}
export function guardarRetornoEncuentro(usuario: string, retorno: RetornoEncuentro | null) {
  try {
    if (retorno) sessionStorage.setItem(clave(usuario), JSON.stringify(retorno));
    else sessionStorage.removeItem(clave(usuario));
  } catch { /* El retorno en memoria permite reintentar aunque el navegador bloquee almacenamiento. */ }
}
