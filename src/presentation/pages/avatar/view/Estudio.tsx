"use client";
import { useUsuario } from "@/security/useUsuario";
import { useEstudio } from "../viewmodel/useEstudio";
import { Icono } from "@/presentation/components/common/Icono";
import { Escena } from "./Escena";
import { Vestidor } from "./Vestidor";
function Mesa({ usuario }: { usuario: string | null }) {
  const vm = useEstudio(usuario);
  return (
    <main>
      <p className="eyebrow breadcrumb">MUNDO AWOO &nbsp; / &nbsp; TALLER</p>
      <div className="pageTitle">
        <div>
          <h1>
            Estudio de avatar<span>.</span>
          </h1>
          <p>Viste a tu lobo y dale movimiento en el claro del bosque.</p>
        </div>
        <span className="tag">{usuario ? "MI CUENTA" : "MODO INVITADO"}</span>
      </div>
      <div className="desk">
        <Vestidor vm={vm} invitado={!usuario} />
        <div className="right">
          <Escena vm={vm} />
          <div className="panel quick">
            <div>
              <Icono nombre="chispa" />
              <b>Acciones rápidas</b>
            </div>
            <button className="neutral" onClick={() => vm.mover("Saludar")}>
              <Icono nombre="Gesto" />
              Saludar
            </button>
            <button className="neutral" onClick={() => vm.mover("Bailar")}>
              <Icono nombre="Baile" />
              Bailar
            </button>
            <button className="neutral" onClick={() => vm.mover("Reposo")}>
              Reposo
            </button>
          </div>
        </div>
      </div>
      <footer>
        MUNDO AWOO <span>ESTUDIO DE AVATAR &nbsp; / &nbsp; 2D</span>
      </footer>
    </main>
  );
}
export function Estudio() {
  const usuario = useUsuario();
  return <Mesa key={usuario ?? "invitado"} usuario={usuario} />;
}
