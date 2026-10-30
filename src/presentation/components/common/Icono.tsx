const caminos = {
  Ropa: "m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4c-1 3-7 3-8 0Z",
  Accesorio: "M2 10h20M3 10l1 6h5l2-5h2l2 5h5l1-6",
  Gesto: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM7 14q5 6 10 0M8 8v2m8-2v2",
  Baile:
    "M8 17V6l12-3v12M8 17c-2-2-7 0-6 3s6 1 6-3Zm12-2c-2-2-7 0-6 3s6 1 6-3Z",
  Fondo: "M3 3h18v18H3zM3 17l6-7 4 5 3-3 5 5M16 7h1",
  play: "m7 4 13 8-13 8z",
  pause: "M8 4v16M16 4v16",
  avatar: "M5 11 4 3l6 4h4l6-4-1 8 2 3-9 7-9-7zM8 12h1m6 0h1m-5 4h2",
  catalogo: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  inventario: "M4 8h16v13H4zM8 8V5q4-5 8 0v3M8 13h8",
  perfil: "M16 7a4 4 0 1 1-8 0 4 4 0 1 1 8 0ZM3 21q0-13 9-9 9-4 9 9",
  flecha: "m9 5 7 7-7 7",
  chispa: "m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z",
};
export type IconoNombre = keyof typeof caminos;
export function Icono({
  nombre,
  size = 19,
}: {
  nombre: IconoNombre;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={caminos[nombre]} />
    </svg>
  );
}
