"use client";
import Link from "next/link";
import { useInventario } from "../viewmodel/useInventario";
import { EstadoVacio } from "@/presentation/components/common/EstadoVacio";
import { Icono } from "@/presentation/components/common/Icono";
export function Inventario() {
  const vm = useInventario();
  return (
    <main id="contenido">
      <div className="pageBanner">
      <p className="eyebrow">03 / TU COLECCIÓN PERSONAL</p>
      <h1>
        Inventario<span>.</span>
      </h1>
      <p>Tu colección, tu identidad. Lleva tus piezas al vestidor y arma la pinta.</p>
      </div>
      <section className="panel form">
        {vm.datos ? (
          vm.datos.length ? (
            <ul className="collection">
              {vm.datos.map(({ item, fechaDesbloqueo }) => (
                <li key={item.id}>
                  <Icono nombre="inventario" />
                  <b>{item.nombre}</b>
                  <small>
                    {item.ranura} ·{" "}
                    {new Date(fechaDesbloqueo).toLocaleDateString("es-CO")}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio icono="inventario" titulo="Tu historia apenas empieza."><p>Todavía no tienes piezas desbloqueadas. Explora el catálogo para conocer la colección.</p><Link className="primary" href="/catalogo">Explorar catálogo ↗</Link></EstadoVacio>
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
