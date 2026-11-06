import type { Personaje3D, Apariencia3D } from "./avatar3d";

export const ranurasPorTipo = {
  Ropa: ["Torso", "Piernas", "Pies"],
  Accesorio: ["Cabeza", "Ojos", "Cuello"],
  Baile: ["Animacion"],
  Gesto: ["Animacion"],
} as const;
export type Tipo = keyof typeof ranurasPorTipo;
export type Ranura = (typeof ranurasPorTipo)[Tipo][number];

export interface Categoria {
  id: string;
  nombre: string;
  tipo: Tipo;
}
export interface Pieza {
  nombre: string;
  ranura: Ranura;
  recursoVisual: string;
}
export interface Item extends Pieza {
  id: string;
  categoriaId: string;
}
export interface Equipado extends Pieza {
  itemDeAvatarId: string;
}
export interface Avatar {
  id: string;
  usuarioId: string;
  colorFondo: string;
  personaje3D: Personaje3D;
  chaquetaGhetto: boolean;
  chaquetaQueen: boolean;
  aparienciaGhetto: Apariencia3D;
  aparienciaQueen: Apariencia3D;
  itemsEquipados: Equipado[];
}
export interface Desbloqueo {
  item: Item;
  fechaDesbloqueo: string;
}
export interface Perfil {
  id: string;
  usuarioId: string;
  nombreVisible: string;
  biografia: string;
}
export interface Sesion {
  usuarioId: string;
  token: string;
  tipoToken: string;
  expiraEnUtc: string;
  refreshToken: string;
  sesionExpiraEnUtc: string;
}
