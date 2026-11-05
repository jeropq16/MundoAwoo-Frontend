"use client";
import Link from "next/link";
import Image from "next/image";
import { useUsuario } from "@/security/useUsuario";
import { useEstudio } from "../viewmodel/useEstudio";
import { Icono } from "@/presentation/components/common/Icono";
import { Escena } from "./Escena";
import { Vestidor } from "./Vestidor";

function Mesa({ usuario }: { usuario: string | null }) {
  const vm = useEstudio(usuario);
  return (
    <main id="contenido" className="studioPage">
      <section id="vestidor" className="studioSection" aria-labelledby="studio-title">
        <div className="pageTitle">
          <div>
            <p className="eyebrow">01 / TU IDENTIDAD, SIN FILTROS</p>
            <h1 id="studio-title">ARMA TU <span>FLOW.</span></h1>
          </div>
          <span className="tag"><span className="liveDot" /> {usuario ? "TU ESTUDIO PERSONAL" : "EXPLORA EN MODO INVITADO"}</span>
        </div>
        <div className="desk">
          <Vestidor vm={vm} invitado={!usuario} />
          <div className="right">
            <Escena vm={vm} />
            <div className="panel quick">
              <div><Icono nombre="Baile" /><span><b>SUELTA EL PASO</b><small>La calle es tu escenario.</small></span></div>
              {([
                ["Saludar", "Gesto", "Saludar"],
                ["Bailar", "Baile", "Bailar"],
                ["Reposo", "avatar", "Relax"],
              ] as const).map(([accion, icono, texto]) => (
                <button key={accion} className="neutral" aria-pressed={vm.movimiento === accion} onClick={() => vm.mover(accion)}>
                  <Icono nombre={icono} />{texto}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="districtCards" aria-label="Más del barrio">
        <Link className="districtCard collectionCard" href="/catalogo">
          <div className="cardSymbol"><Icono nombre="Ropa" size={42} /></div>
          <div><span className="eyebrow">EL ARMARIO DEL BARRIO</span><h3>LA PINTA HABLA.</h3><p>Encuentra tu próxima pieza en el catálogo.</p></div>
          <span className="cardArrow" aria-hidden="true">↗</span>
        </Link>
        <a className="districtCard musicCard" href="https://ryancastrooficial.lnk.to/ECDGH" target="_blank" rel="noopener noreferrer">
          <Image src="/images/el-cantante-del-ghetto.jpg" alt="Portada de El Cantante del Ghetto, de Ryan Castro" width={88} height={88} />
          <div><span className="eyebrow">LA INSPIRACIÓN DEL BARRIO</span><h3>RYAN CASTRO</h3><p>El Cantante del Ghetto <span>· Escuchar ↗</span></p></div>
          <span className="musicBars" aria-hidden="true"><i /><i /><i /><i /></span>
        </a>
      </section>
    </main>
  );
}
export function Estudio() {
  const usuario = useUsuario();
  return <Mesa key={usuario ?? "invitado"} usuario={usuario} />;
}
