import Link from "next/link";
import { nombres } from "../viewmodel/muestras";
import { Icono } from "@/presentation/components/common/Icono";
import type { useEstudio } from "../viewmodel/useEstudio";
type EstudioVM = ReturnType<typeof useEstudio>;
const secciones = Object.keys(nombres) as (keyof typeof nombres)[];
const colores = ["#aad8d1", "#afcbea", "#efc3aa", "#b9afd9", "#e3d796"];
export function Vestidor({ vm, invitado }: { vm: EstudioVM; invitado: boolean }) {
  return (
    <aside className="panel tools">
      <div className="panelHead">
        <span className="eyebrow">PANEL DE CONTROL</span>
        <h2>Personalización</h2>
      </div>
      <div className="toolList">
        {secciones.map((t) => (
          <button
            key={t}
            className="tool"
            aria-pressed={vm.tipo === t}
            onClick={() => vm.seleccionar(t)}
          >
            <i>
              <Icono nombre={t} />
            </i>
            {nombres[t]}
            <span>›</span>
          </button>
        ))}
      </div>
      <div className="choices">
        <div className="smallTitle">
          {invitado ? "Prueba libre" : "Mi selección"}{" "}
          <span>{nombres[vm.tipo]}</span>
        </div>
        {vm.estado === "error" ? (
          <button onClick={vm.reintentar}>Volver a cargar</button>
        ) : vm.estado === "cargando" ? (
          <p>Cargando tu avatar…</p>
        ) : vm.tipo === "Fondo" ? (
          <div className="swatches">
            {colores.map((c) => (
              <button
                key={c}
                disabled={vm.ocupado}
                aria-pressed={vm.avatar.colorFondo.toLowerCase() === c}
                aria-label={"Elegir fondo " + c}
                style={{ background: c }}
                onClick={() => vm.color(c)}
              />
            ))}
            <form
              key={vm.avatar.colorFondo}
              onSubmit={(e) => {
                e.preventDefault();
                void vm.color(
                  String(new FormData(e.currentTarget).get("color")),
                );
              }}
            >
              <label>
                Otro color
                <input
                  type="color"
                  name="color"
                  defaultValue={vm.avatar.colorFondo}
                />
              </label>
              <button disabled={vm.ocupado}>Aplicar color</button>
            </form>
          </div>
        ) : vm.piezas.length ? (
          vm.piezas.map(({ item }) => {
            const equipado = vm.avatar.itemsEquipados.some(
              (p) => p.itemDeAvatarId === item.id,
            );
            return (
              <button
                key={item.id}
                className="piece"
                aria-pressed={equipado}
                disabled={vm.ocupado}
                onClick={() => vm.elegir(item)}
              >
                {item.nombre}
                <span>{equipado ? "Quitar" : "Equipar"}</span>
              </button>
            );
          })
        ) : (
          <p>
            Aún no tienes piezas de esta categoría.{" "}
            <Link href="/catalogo">Ver catálogo</Link>
          </p>
        )}
      </div>
    </aside>
  );
}
