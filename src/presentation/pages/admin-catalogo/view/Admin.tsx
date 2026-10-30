"use client";
import { useAdmin } from "../viewmodel/useAdmin";
import { ranurasPorTipo, type Tipo } from "@/domain/entities/mundo";
export function Admin() {
  const vm = useAdmin();
  return (
    <main>
      <p className="eyebrow">MUNDO AWOO / ADMINISTRACIÓN</p>
      <h1>
        Gestionar catálogo<span>.</span>
      </h1>
      <p>Estas operaciones requieren permisos de administrador.</p>
      <div className="adminGrid">
        <form
          className="panel form"
          onSubmit={(e) => {
            e.preventDefault();
            void vm.crearCategoria(new FormData(e.currentTarget));
          }}
        >
          <h2>Nueva categoría</h2>
          <label>
            Nombre
            <input name="nombre" required maxLength={50} />
          </label>
          <label>
            Tipo
            <select
              value={vm.tipo}
              onChange={(e) => vm.setTipo(e.target.value as Tipo)}
            >
              {Object.keys(ranurasPorTipo).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <button className="primary" disabled={vm.ocupado}>
            Crear categoría
          </button>
        </form>
        <section className="panel form">
          <label>
            Categoría de trabajo
            <select value={vm.id} onChange={(e) => vm.elegir(e.target.value)}>
              {vm.categorias.datos?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
          <button onClick={vm.categorias.recargar}>
            Actualizar categorías
          </button>
          <form
            className="form inset"
            onSubmit={(e) => {
              e.preventDefault();
              void vm.crearItem(new FormData(e.currentTarget));
            }}
          >
            <h2>Nueva pieza</h2>
            <label>
              Nombre
              <input name="nombre" required maxLength={100} />
            </label>
            <label>
              Ranura
              <select name="ranura" required>
                {vm.ranuras.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label>
              Recurso visual
              <input
                name="recursoVisual"
                required
                maxLength={500}
                placeholder="/piezas/poncho.svg"
              />
            </label>
            <button
              className="primary"
              disabled={!vm.ranuras.length || vm.ocupado}
            >
              Crear pieza
            </button>
          </form>
          <form
            className="form inset"
            onSubmit={(e) => {
              e.preventDefault();
              void vm.conceder(new FormData(e.currentTarget));
            }}
          >
            <h2>Desbloquear pieza</h2>
            <label>
              Pieza
              <select name="item" required>
                {vm.items.datos?.map((i) => (
                  <option value={i.id} key={i.id}>
                    {i.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label>
              ID del usuario
              <input
                name="usuario"
                required
                pattern="[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}"
              />
            </label>
            <button
              className="primary"
              disabled={!vm.items.datos?.length || vm.ocupado}
            >
              Desbloquear
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
