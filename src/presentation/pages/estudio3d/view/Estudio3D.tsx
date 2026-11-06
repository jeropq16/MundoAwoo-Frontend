"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { personajes3D, type Personaje3D } from "@/domain/entities/avatar3d";
import { useUsuario } from "@/security/useUsuario";
import { Icono } from "@/presentation/components/common/Icono";
import { Vestidor } from "../../avatar/view/Vestidor";
import { recurso3D } from "@/presentation/components/avatar3d/recursos3d";
import { useEstudio3D } from "../viewmodel/useEstudio3D";
import "./estudio3d.css";

const Visor3D = dynamic(() => import("@/presentation/components/avatar3d/Visor3D"), {
  ssr: false,
  loading: () => <p className="labFallback" role="status">Preparando tu mundo 3D…</p>,
});

function Mesa3D({ usuario }: { usuario: string | null }) {
  const vm = useEstudio3D(usuario);
  const bloqueado = vm.ocupado || vm.estado !== "listo";
  const incompatibles = vm.avatar.itemsEquipados.filter((p) => !recurso3D(p));
  return (
    <main id="contenido" className="labPage">
      <div className="pageTitle">
        <div>
          <p className="eyebrow">MUNDO AWOO / TU ESTUDIO</p>
          <h1>EL FLOW EN <span>3D.</span></h1>
        </div>
        <span className="tag" role="status"><span className="liveDot" />{usuario ? vm.ocupado ? "GUARDANDO…" : vm.estado === "listo" ? "GUARDADO EN TU CUENTA" : vm.estado === "error" ? "NO SE PUDO CARGAR" : "CARGANDO TU AVATAR…" : "MODO INVITADO"}</span>
      </div>
      {vm.estado === "error" && <div className="panel labError" role="alert"><p>No pudimos cargar tu avatar. Reintenta para continuar con tu selección guardada.</p><button onClick={vm.reintentar}>Volver a cargar</button></div>}
      <div className="labGrid">
        <div className="labSidebar">
          <aside className="panel labTools">
            <p className="eyebrow">01 / ELIGE TU PERSONAJE</p>
            {(Object.keys(personajes3D) as Personaje3D[]).map((id) => (
              <button key={id} disabled={bloqueado} aria-pressed={vm.personaje === id} onClick={() => void vm.cambiarPersonaje(id)}>
                {personajes3D[id].nombre}<span>{id === "queen" ? "QUEEN EDITION" : "BOY EDITION"}</span>
              </button>
            ))}
            <p className="eyebrow">02 / TU PINTA BASE</p>
            <button disabled={bloqueado || Boolean(vm.torso)} aria-pressed={vm.chaqueta} onClick={() => void vm.alternarChaqueta()}>
              {vm.torso ? vm.torso.nombre : vm.chaquetaBase ? "Quitar chaqueta" : "Poner chaqueta"}<span>{vm.torso ? "PRENDA DEL INVENTARIO" : "BOMBER AWOO · INCLUIDA"}</span>
            </button>
            {vm.torso && <p className="labNote">Quita la prenda equipada en el vestidor para cambiar la bomber base.</p>}
            <p className="labNote">{usuario ? "El personaje, la bomber de cada personaje, el ambiente y tu inventario se guardan automáticamente." : <>Prueba los personajes y las piezas. <Link href="/registro">Crea tu cuenta</Link> para guardar tu estilo.</>}</p>
          </aside>
          <Vestidor vm={vm} invitado={!usuario} />
        </div>
        <div className="labPreview">
          <section className="panel labStage" aria-label="Vista previa del avatar 3D">
            <div className="labTitle"><h2>{personajes3D[vm.personaje].nombre}</h2><span role="status">{vm.pausa ? "En pausa" : vm.movimiento === "Bailar" ? "Bailando" : vm.movimiento === "Saludar" ? "Saludando" : "En reposo"} · {vm.chaqueta ? "Con chaqueta" : "Sin chaqueta"}</span></div>
            <div className="labCanvas" aria-busy={vm.estado === "cargando"}>
              <Visor3D personaje={vm.personaje} chaqueta={vm.chaqueta} movimiento={vm.movimiento} pausa={vm.pausa} colorFondo={vm.avatar.colorFondo} piezas={vm.avatar.itemsEquipados} camara={vm.camara} />
            </div>
            <div className="labCamera"><p>Arrastra para girar · Rueda o pellizco para acercarte</p><div><button onClick={() => vm.girar(0)}>Frente</button><button onClick={() => vm.girar(Math.PI / 2)}>Perfil</button><button onClick={() => vm.girar(Math.PI)}>Espalda</button></div></div>
          </section>
          <div className="panel quick">
            <div><Icono nombre="Baile" /><span><b>SUELTA EL PASO</b><small>Tu personaje, tu movimiento.</small></span></div>
            {([ ["Saludar", "Saludar"], ["Bailar", "Bailar"], ["Reposo", "Relax"] ] as const).map(([accion, label]) => <button key={accion} className="neutral" aria-pressed={vm.movimiento === accion} onClick={() => vm.mover(accion)}>{label}</button>)}
            <button className="neutral" onClick={() => vm.pausar(!vm.pausa)}><Icono nombre={vm.pausa ? "play" : "pause"} size={13} />{vm.pausa ? "Reanudar" : "Pausar"}</button>
          </div>
          {incompatibles.length > 0 && <p className="labNote" role="status">{incompatibles.length} pieza(s) de tu inventario todavía no tienen versión 3D. Puedes quitarlas desde el vestidor.</p>}
          <div className="panel labLinks"><Link href="/catalogo">Explorar catálogo ↗</Link><Link href={usuario ? "/inventario" : "/login"}>{usuario ? "Mi inventario ↗" : "Entrar al barrio ↗"}</Link></div>
        </div>
      </div>
    </main>
  );
}
export function Estudio3D() {
  const usuario = useUsuario();
  return <Mesa3D key={usuario ?? "invitado"} usuario={usuario} />;
}
