import type {
  Categoria,
  Desbloqueo,
  Item,
  Tipo,
} from "@/domain/entities/mundo";
export const nombres = {
  Ropa: "Ropa",
  Accesorio: "Accesorios",
  Gesto: "Gestos",
  Baile: "Bailes",
  Fondo: "Ambiente",
};
export const muestras: Categoria[] = (
  ["Ropa", "Accesorio", "Gesto", "Baile"] as Tipo[]
).map((tipo) => ({ id: tipo, nombre: nombres[tipo], tipo }));
const piezas: Item[] = [
  {
    id: "gorra",
    nombre: "Gorra Awoo",
    categoriaId: "Accesorio",
    ranura: "Cabeza",
    recursoVisual: "awoo3d:gorra",
  },
  {
    id: "poncho",
    nombre: "Chaqueta Ghetto",
    categoriaId: "Ropa",
    ranura: "Torso",
    recursoVisual: "awoo3d:bomber",
  },
  {
    id: "lentes",
    nombre: "Gafas de sol",
    categoriaId: "Accesorio",
    ranura: "Ojos",
    recursoVisual: "awoo3d:lentes",
  },
  {
    id: "saludo",
    nombre: "Saludo del barrio",
    categoriaId: "Gesto",
    ranura: "Animacion",
    recursoVisual: "awoo3d:saludo",
  },
  {
    id: "paso",
    nombre: "Paso de la calle",
    categoriaId: "Baile",
    ranura: "Animacion",
    recursoVisual: "awoo3d:baile",
  },
];
export const armarioMuestra: Desbloqueo[] = piezas.map((item) => ({
  item,
  fechaDesbloqueo: "",
}));
