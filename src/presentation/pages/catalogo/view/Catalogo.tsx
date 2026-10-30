"use client";
import { useCatalogo } from "../viewmodel/useCatalogo";
import { Icono } from "@/presentation/components/common/Icono";
export function Catalogo() {
  const { categorias, id, elegir, items } = useCatalogo();
  return (
    <main>
      <p className="eyebrow">MUNDO AWOO / COLECCIÓN</p>
      <h1>
        Catálogo<span>.</span>
      </h1>
      <p>Explora las piezas por categoría.</p>
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
          <p>Aún no hay categorías publicadas.</p>
        ) : (
          <button onClick={categorias.recargar}>Reintentar catálogo</button>
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
              <p>Esta categoría aún no tiene piezas.</p>
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
