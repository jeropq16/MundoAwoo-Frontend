import type { Pieza } from "@/domain/entities/mundo";

export type VistaAvatar = "frente" | "espalda";
export const spriteRyan = "/avatar/ryan-castro.webp";

// Keep the existing resource URL compatible with catalog items already stored by the API.
// Match the local resource, never an arbitrary item's display name or an external URL.
export function esChaquetaGhetto(pieza: Pieza) {
  return pieza.ranura === "Torso" &&
    ["/piezas/poncho.svg", "/piezas/chaqueta-ghetto.svg"].includes(pieza.recursoVisual);
}

export function frameRyan(piezas: Pieza[], vista: VistaAvatar) {
  return (vista === "espalda" ? 2 : 0) + (piezas.some(esChaquetaGhetto) ? 1 : 0);
}
