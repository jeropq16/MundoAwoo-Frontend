import type { useEstudio } from "../viewmodel/useEstudio";
import { Icono } from "@/presentation/components/common/Icono";
import { AvatarPixi } from "@/presentation/components/AvatarPixi";
type EstudioVM = ReturnType<typeof useEstudio>;
export function Escena({ vm }: { vm: EstudioVM }) {
  return (
    <section className="panel preview">
      <div className="sceneHead">
        <div>
          <span className="eyebrow">ESCENARIO 01</span>
          <h2>Claro del bosque</h2>
        </div>
        <span className="chip">
          <i /> Vista previa
        </span>
      </div>
      <div className="scene" style={{ backgroundColor: vm.avatar.colorFondo }}>
        <span className="sceneLabel">◆ &nbsp; AWOO VALLEY</span>
        <div className="shadow" />
        <AvatarPixi
          piezas={vm.avatar.itemsEquipados}
          movimiento={vm.movimiento}
          pausa={vm.pausa}
        />
      </div>
      <div className="sceneFoot">
        <div>
          <span className="eyebrow">ESTADO DEL AVATAR</span>
          <strong>
            <i />
            {vm.pausa
              ? "En pausa"
              : vm.movimiento === "Reposo"
                ? "En reposo"
                : vm.movimiento === "Bailar"
                  ? "Bailando"
                  : "Saludando"}
          </strong>
        </div>
        <button className="neutral" onClick={() => vm.pausar(!vm.pausa)}>
          <Icono nombre={vm.pausa ? "play" : "pause"} size={15} />
          {vm.pausa ? "Reanudar" : "Pausar"}
        </button>
      </div>
    </section>
  );
}
