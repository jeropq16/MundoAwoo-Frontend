import type { useEstudio } from "../viewmodel/useEstudio";
import { Icono } from "@/presentation/components/common/Icono";
import { AvatarPixi } from "@/presentation/components/AvatarPixi";
import { useState, type CSSProperties } from "react";
import type { VistaAvatar } from "@/presentation/components/avatarApariencia";
type EstudioVM = ReturnType<typeof useEstudio>;
export function Escena({ vm }: { vm: EstudioVM }) {
  const [vista, setVista] = useState<VistaAvatar>("frente");
  return (
    <section className="panel preview">
      <div className="sceneHead">
        <div>
          <span className="eyebrow">EN LAS CALLES DE AWOO</span>
          <h3>LA ESQUINA DEL GHETTO <span>↗</span></h3>
        </div>
        <span className="chip">
          <i /> Vista previa
        </span>
      </div>
      <div className="scene" style={{ "--scene-color": vm.avatar.colorFondo } as CSSProperties}>
        <span className="sceneLabel"><span className="liveDot" /> MEDELLÍN, COLOMBIA</span>
        <span className="sceneGraffiti" aria-hidden="true">AWOO!</span>
        <span className="sceneEdition" aria-hidden="true">BARRIO<br />EDITION / 01</span>
        <div className="sceneAura" />
        <div className="shadow" />
        <AvatarPixi
          piezas={vm.avatar.itemsEquipados}
          movimiento={vm.movimiento}
          pausa={vm.pausa}
          vista={vista}
        />
        <span className="avatarName">RYAN CASTRO · {vista === "frente" ? "FRENTE" : "ESPALDA"} <Icono nombre="chispa" size={12} /></span>
      </div>
      <div className="sceneFoot">
        <div>
          <span className="eyebrow">ESTADO DEL AVATAR</span>
          <strong>
            <i />
            {vm.pausa
              ? "En pausa"
              : vm.movimiento === "Reposo"
                ? "En su flow"
                : vm.movimiento === "Bailar"
                  ? "Bailando"
                  : "Saludando"}
          </strong>
        </div>
        <div className="viewControls">
        <button className="neutral" aria-label={vista === "frente" ? "Ver espalda de Ryan" : "Ver frente de Ryan"} onClick={() => setVista(vista === "frente" ? "espalda" : "frente")}>
          <span aria-hidden="true">↻</span> {vista === "frente" ? "Ver espalda" : "Ver frente"}
        </button>
        <button className="neutral" onClick={() => vm.pausar(!vm.pausa)}>
          <Icono nombre={vm.pausa ? "play" : "pause"} size={15} />
          {vm.pausa ? "Reanudar" : "Pausar"}
        </button>
        </div>
      </div>
    </section>
  );
}
