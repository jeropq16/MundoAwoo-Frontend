import { Icono, type IconoNombre } from "./Icono";

export function EstadoVacio({ icono, titulo, children }: {
  icono: IconoNombre;
  titulo: string;
  children: React.ReactNode;
}) {
  return <div className="emptyState"><Icono nombre={icono} size={38} /><h2>{titulo}</h2>{children}</div>;
}
