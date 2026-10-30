"use client";
import Link from "next/link";
import { useInventario } from "../viewmodel/useInventario";
export function Inventario() {
  const vm = useInventario();
  return (
    <main>
      <p className="eyebrow">MI COLECCIÓN</p>
      <h1>
        Inventario<span>.</span>
      </h1>
      <p>Estas son las piezas que puedes equipar en el estudio.</p>
      <section className="panel form">
        {vm.datos ? (
          vm.datos.length ? (
            <ul className="collection">
              {vm.datos.map(({ item, fechaDesbloqueo }) => (
                <li key={item.id}>
                  <b>{item.nombre}</b>
                  <small>
                    {item.ranura} ·{" "}
                    {new Date(fechaDesbloqueo).toLocaleDateString("es-CO")}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p>Todavía no tienes piezas desbloqueadas.</p>
          )
        ) : vm.cargando ? (
          <p>Cargando inventario…</p>
        ) : (
          <button onClick={vm.recargar}>Reintentar</button>
        )}
        <Link href="/avatar">Ir al vestidor →</Link>
      </section>
    </main>
  );
}
