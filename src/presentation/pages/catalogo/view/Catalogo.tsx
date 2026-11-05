"use client";
import Link from "next/link";
import { useCatalogo } from "../viewmodel/useCatalogo";
import { Icono } from "@/presentation/components/common/Icono";
import { EstadoVacio } from "@/presentation/components/common/EstadoVacio";
export function Catalogo() {
  const { categorias, id, elegir, items } = useCatalogo();
  return (
    <main id="contenido">
      <div className="pageBanner">
      <p className="eyebrow">02 / EL ARMARIO DEL BARRIO</p>
      <h1>
        Catálogo<span>.</span>
      </h1>
      <p>Piezas con calle. Explora el catálogo y encuentra lo que va contigo.</p>
      </div>
      <section className="panel form">
        {categorias.datos?.length ? (
          <label>
            Categoría
            <select value={id} onChange={(e) => elegir(e.target.value)}>
              {categorias.datos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
        ) : categorias.cargando ? (
          <p>Cargando categorías…</p>
        ) : categorias.datos ? (
          <EstadoVacio icono="Ropa" titulo="El próximo drop está por llegar."><p>Aún no hay categorías publicadas. Mientras tanto, prueba las piezas de muestra en tu mundo.</p><Link className="primary" href="/">Ir al vestidor ↗</Link></EstadoVacio>
        ) : (
          <EstadoVacio icono="catalogo" titulo="No pudimos abrir el catálogo."><p>No fue posible cargar la colección. Inténtalo de nuevo en un momento.</p><button onClick={categorias.recargar}>Reintentar catálogo ↻</button></EstadoVacio>
        )}
        {id &&
          (items.datos ? (
            items.datos.length ? (
              <ul className="collection">
                {items.datos.map((i) => (
                  <li key={i.id}>
                    <Icono
                      nombre={
                        categorias.datos?.find((c) => c.id === id)?.tipo ??
                        "Ropa"
                      }
                    />
                    <strong>{i.nombre}</strong>
                    <small>{i.ranura}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <EstadoVacio icono="Ropa" titulo="Aquí viene más flow."><p>Esta categoría todavía no tiene piezas. Explora otra categoría.</p></EstadoVacio>
            )
          ) : items.cargando ? (
            <p>Cargando piezas…</p>
          ) : (
            <button onClick={items.recargar}>Reintentar piezas</button>
          ))}
      </section>
    </main>
  );
}
