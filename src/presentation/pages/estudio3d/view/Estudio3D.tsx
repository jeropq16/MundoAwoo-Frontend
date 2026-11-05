"use client";
import dynamic from "next/dynamic";
import { personajes3D, type Personaje3D } from "@/domain/entities/avatar3d";
import { useEstudio3D } from "../viewmodel/useEstudio3D";
import "./estudio3d.css";
const Visor3D = dynamic(
  () => import("@/presentation/components/avatar3d/Visor3D"),
  {
    ssr: false,
    loading: () => (
      <p className="labFallback" role="status">
        Preparando el estudio 3D…
      </p>
    ),
  },
);
export function Estudio3D() {
  const vm = useEstudio3D();
  return (
    <main id="contenido" className="labPage">
      <div className="pageTitle">
        <div>
          <p className="eyebrow">AWOO LAB / PRUEBA 01</p>
          <h1>
            EL FLOW EN <span>3D.</span>
          </h1>
        </div>
        <span className="tag">PERSONAJES EXPERIMENTALES</span>
      </div>
      <div className="labGrid">
        <aside className="panel labTools">
          <p className="eyebrow">01 / ELIGE TU PERSONAJE</p>
          {(Object.keys(personajes3D) as Personaje3D[]).map((id) => (
            <button
              key={id}
              aria-pressed={vm.personaje === id}
              onClick={() => vm.cambiarPersonaje(id)}
            >
              {personajes3D[id].nombre}
              <span>{id === "queen" ? "QUEEN EDITION" : "BOY EDITION"}</span>
            </button>
          ))}
          <p className="eyebrow">02 / CAMBIA LA PINTA</p>
          <button aria-pressed={vm.chaqueta} onClick={vm.alternarPrenda}>
            {vm.chaqueta ? "Quitar chaqueta" : "Poner chaqueta"}
            <span>BOMBER AWOO</span>
          </button>
          <p className="eyebrow">03 / SUELTA EL PASO</p>
          <button
            className="primary"
            aria-pressed={vm.bailando}
            onClick={vm.alternarBaile}
          >
            {vm.bailando ? "Detener baile" : "Probar baile"}
          </button>
          <p className="labNote">
            Prueba libre. Puedes cambiar de personaje y vestir a cada uno
            durante esta visita.
          </p>
        </aside>
        <section className="panel labStage">
          <div className="labTitle">
            <h2>{personajes3D[vm.personaje].nombre}</h2>
            <span role="status">
              {vm.bailando ? "Bailando" : "En reposo"} ·{" "}
              {vm.chaqueta ? "Con chaqueta" : "Sin chaqueta"}
            </span>
          </div>
          <div className="labCanvas">
            <Visor3D
              personaje={vm.personaje}
              chaqueta={vm.chaqueta}
              bailando={vm.bailando}
              camara={vm.camara}
            />
          </div>
          <div className="labCamera">
            <p>Arrastra para girar · Pellizca o usa la rueda para acercarte</p>
            <div>
              <button onClick={() => vm.girar(0)}>Frente</button>
              <button onClick={() => vm.girar(Math.PI / 2)}>Perfil</button>
              <button onClick={() => vm.girar(Math.PI)}>Espalda</button>
            </div>
          </div>
        </section>
      </div>
      <p className="labCaption">
        Modelos estilizados de prueba · Baile articulado procedural · Los
        cambios de este laboratorio son temporales.
      </p>
    </main>
  );
}
