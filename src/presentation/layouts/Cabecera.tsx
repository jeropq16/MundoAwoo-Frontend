"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUsuario } from "@/security/useUsuario";
import { Icono } from "../components/common/Icono";
export function Cabecera() {
  const ruta = usePathname();
  const usuario = useUsuario();
  return (
    <header>
      <div className="bar">
        <Link className="brand" href="/">
          <b>
            <Icono nombre="avatar" size={27} />
          </b>
          Mundo<span>Awoo</span>
        </Link>
        <nav aria-label="Principal">
          {(
            [
              ["/", "avatar", "Estudio"],
              ["/catalogo", "catalogo", "Catálogo"],
              ["/inventario", "inventario", "Inventario"],
            ] as const
          ).map(([href, icon, label]) => (
            <Link
              key={href}
              aria-current={
                ruta === href || (href === "/" && ruta === "/avatar")
                  ? "page"
                  : undefined
              }
              href={href}
            >
              <Icono nombre={icon} />
              {label}
            </Link>
          ))}
        </nav>
        <Link className="account" href={usuario ? "/perfil" : "/login"}>
          <Icono nombre="perfil" />
          {usuario ? "Mi perfil" : "Iniciar sesión"}
        </Link>
      </div>
    </header>
  );
}
