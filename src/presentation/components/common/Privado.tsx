"use client";
import Link from "next/link";
import { useUsuario } from "@/security/useUsuario";
export function Privado({ children }: { children: React.ReactNode }) {
  const usuario = useUsuario();
  return usuario ? (
    <section key={usuario}>{children}</section>
  ) : (
    <main className="narrow">
      <p className="eyebrow">MUNDO AWOO / CUENTA</p>
      <h1>
        Entra al claro<span>.</span>
      </h1>
      <p>Inicia sesión para consultar tu cuenta.</p>
      <Link className="primary" href="/login">
        Iniciar sesión
      </Link>
    </main>
  );
}
