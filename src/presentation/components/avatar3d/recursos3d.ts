import type { Pieza } from "@/domain/entities/mundo";

// Procedural models stay attached to the rig; arbitrary 2D URLs are never
// presented as successfully rendered 3D equipment.
const modelos = {
  "awoo3d:bomber": ["Torso", "bomber"],
  "awoo3d:gorra": ["Cabeza", "gorra"],
  "awoo3d:lentes": ["Ojos", "lentes"],
  "awoo3d:cadena": ["Cuello", "cadena"],
  "awoo3d:pantalon": ["Piernas", "pantalon"],
  "awoo3d:zapatillas": ["Pies", "zapatillas"],
  "awoo3d:baile": ["Animacion", "baile"],
  "awoo3d:saludo": ["Animacion", "saludo"],
  "/piezas/poncho.svg": ["Torso", "bomber"],
  "/piezas/chaqueta-ghetto.svg": ["Torso", "bomber"],
  "/piezas/gorra.svg": ["Cabeza", "gorra"],
  "/piezas/lentes.svg": ["Ojos", "lentes"],
  "paso": ["Animacion", "baile"],
  "saludo": ["Animacion", "saludo"],
} as const;
export type Modelo3D = (typeof modelos)[keyof typeof modelos][1];
export function recurso3D(pieza: Pieza): Modelo3D | null {
  const modelo = modelos[pieza.recursoVisual as keyof typeof modelos];
  return modelo?.[0] === pieza.ranura ? modelo[1] : null;
}
