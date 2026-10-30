"use client";
import Link from "next/link";
import { usePerfil } from "../viewmodel/usePerfil";
export function Perfil() {
  const vm = usePerfil();
  return (
    <main className="narrow">
      <p className="eyebrow">MI CUENTA</p>
      <h1>
        Mi perfil<span>.</span>
      </h1>
      {vm.datos ? (
        <form
          className="form panel"
          onSubmit={(e) => {
            e.preventDefault();
            void vm.guardar(new FormData(e.currentTarget));
          }}
        >
          <label>
            Nombre visible
            <input
              name="nombreVisible"
              defaultValue={vm.datos.nombreVisible}
              maxLength={50}
              required
            />
          </label>
          <label>
            Biografía
            <textarea
              name="biografia"
              defaultValue={vm.datos.biografia}
              maxLength={500}
            />
          </label>
          <button className="primary" disabled={vm.ocupado}>
            Guardar perfil
          </button>
        </form>
      ) : vm.cargando ? (
        <p>Cargando perfil…</p>
      ) : (
        <button onClick={vm.recargar}>Reintentar</button>
      )}
      <div className="actions">
        <Link href="/admin/catalogo">Herramientas de administración</Link>
        <button disabled={vm.ocupado} onClick={vm.salir}>
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
