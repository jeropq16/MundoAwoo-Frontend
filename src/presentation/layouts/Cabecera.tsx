"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUsuario } from "@/security/useUsuario";
import { Icono } from "../components/common/Icono";
export function Cabecera() {
  const ruta = usePathname();
  const usuario = useUsuario();
  return (
    <header className="siteHeader">
      <div className="bar">
        <Link className="brand" href="/">
          <b>
            <Icono nombre="avatar" size={27} />
          </b>
          <span className="brandWords">MUNDO <strong>AWOO<span>®</span></strong></span>
        </Link>
        <nav aria-label="Principal">
          {(
            [
              ["/", "avatar", "Mi mundo"],
              ["/laboratorio-3d", "chispa", "Estudio 3D"],
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
          {usuario ? "Mi perfil" : "Entrar al barrio"}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
