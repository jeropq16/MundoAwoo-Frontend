import Link from "next/link";
import { nombres } from "../viewmodel/muestras";
import { Icono } from "@/presentation/components/common/Icono";
import type { useEstudio } from "../viewmodel/useEstudio";
import { recurso3D } from "@/presentation/components/avatar3d/recursos3d";
type EstudioVM = ReturnType<typeof useEstudio>;
const secciones = Object.keys(nombres) as (keyof typeof nombres)[];
const colores = ["#e52836", "#e7b65a", "#a568de", "#4587c9", "#d3d0c5"];
export function Vestidor({ vm, invitado }: { vm: EstudioVM; invitado: boolean }) {
  return (
    <aside className="panel tools">
      <div className="panelHead">
        <span className="eyebrow">HECHO A TU MANERA</span>
        <h3>EL VESTIDOR<span>↙</span></h3>
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
          {invitado ? "Pruébatelo" : "Mi selección"}{" "}
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
                disabled={vm.ocupado || vm.estado !== "listo"}
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
                Tu color de ambiente
                <input
                  type="color"
                  name="color"
                  defaultValue={vm.avatar.colorFondo}
                />
              </label>
              <button disabled={vm.ocupado || vm.estado !== "listo"}>Aplicar color</button>
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
                disabled={vm.ocupado || vm.estado !== "listo" || (!equipado && !recurso3D(item))}
                onClick={() => vm.elegir(item)}
              >
                <i className="pieceIcon"><Icono nombre={vm.tipo === "Fondo" ? "Ropa" : vm.tipo} size={26} /></i>
                <span className="pieceName">{item.nombre}<small>{recurso3D(item) ? (item.ranura === "Animacion" ? "Movimiento 3D" : "Pieza 3D") : "Recurso sin versión 3D"}</small></span>
                <span className="pieceAction">{equipado ? "Quitar −" : "Equipar +"}</span>
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
      <div className="wardrobeNote">
        <Icono nombre={invitado ? "chispa" : "avatar"} size={20} />
        {invitado ? <p>Esto es solo el comienzo.<br /><Link href="/registro">Crea tu cuenta y entra al barrio ↗</Link></p> : <p>Tu estilo, a tu nombre.<br /><Link href="/inventario">Ver todo mi inventario ↗</Link></p>}
      </div>
    </aside>
  );
}
