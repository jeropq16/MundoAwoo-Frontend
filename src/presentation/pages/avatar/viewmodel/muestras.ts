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
  Fondo: "Escenario",
};
export const muestras: Categoria[] = (
  ["Ropa", "Accesorio", "Gesto", "Baile"] as Tipo[]
).map((tipo) => ({ id: tipo, nombre: nombres[tipo], tipo }));
const piezas: Item[] = [
  {
    id: "poncho",
    nombre: "Poncho del valle",
    categoriaId: "Ropa",
    ranura: "Torso",
    recursoVisual: "/piezas/poncho.svg",
  },
  {
    id: "lentes",
    nombre: "Gafas de sol",
    categoriaId: "Accesorio",
    ranura: "Ojos",
    recursoVisual: "/piezas/lentes.svg",
  },
  {
    id: "saludo",
    nombre: "Saludo del bosque",
    categoriaId: "Gesto",
    ranura: "Animacion",
    recursoVisual: "saludo",
  },
  {
    id: "paso",
    nombre: "Paso lunar",
    categoriaId: "Baile",
    ranura: "Animacion",
    recursoVisual: "paso",
  },
];
export const armarioMuestra: Desbloqueo[] = piezas.map((item) => ({
  item,
  fechaDesbloqueo: "",
}));
