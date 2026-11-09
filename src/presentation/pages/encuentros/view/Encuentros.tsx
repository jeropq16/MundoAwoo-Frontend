"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChatSala } from "@/presentation/components/encuentros/ChatSala";
import { useEncuentro } from "../viewmodel/useEncuentro";
import "./encuentros.css";

const EscenaEncuentro = dynamic(() => import("@/presentation/components/encuentros/EscenaEncuentro"), { ssr: false, loading: () => <p className="encuentroCarga">Preparando el punto de encuentro…</p> });
const estados = { conectando: "Conectando…", conectado: "En línea", reconectando: "Recuperando conexión…", desconectado: "Sin conexión" };

export function Encuentros() {
  const vm = useEncuentro();
  return <main id="contenido" className="encuentroPage">
    <div className="pageTitle"><div><p className="eyebrow">MUNDO AWOO / EL PUNTO DE ENCUENTRO</p><h1>ENCUENTRO CON <span>PARCEROS.</span></h1></div><span className="tag" role="status">{estados[vm.estado]}</span></div>
    {vm.estado === "desconectado" && <div className="panel encuentroAviso"><p>Se perdió la conexión. Reconecta para volver a entrar con el código de tu sala.</p><button onClick={vm.reconectar}>Reconectar</button></div>}
    {!vm.sala ? <div className="encuentroEntrada">
      <section className="panel"><p className="eyebrow">01 / ARMA EL PARCHE</p><h2>Tu gente.<br />El mismo lugar.</h2><p>Crea una sala y comparte el código. Cada parcero llega con el personaje, la ropa y la apariencia que guardó en su cuenta.</p><button onClick={() => void vm.crear()} disabled={!vm.lista}>Crear sala</button><small>Hasta 6 personas · Chat escrito · Saludos y baile</small></section>
      <section className="panel"><p className="eyebrow">02 / ÚNETE AL PARCHE</p><h2>¿Te están esperando?</h2><form onSubmit={(evento) => { evento.preventDefault(); void vm.unirse(); }}><label htmlFor="codigo-sala">Código de la sala</label><input id="codigo-sala" value={vm.codigo} onChange={(e) => vm.setCodigo(e.target.value.toUpperCase())} placeholder="Ej. A1B2C3D4E5F6" maxLength={12} autoComplete="off" spellCheck={false} /><button disabled={!vm.lista || !vm.codigo.trim()} type="submit">Entrar a la sala</button></form><p>Comparte el código solo con las personas que quieras invitar.</p></section>
    </div> : <>
      <div className="panel encuentroBarra"><div><small>CÓDIGO PARA TUS PARCEROS</small><strong>{vm.sala.codigo}</strong></div><button className="neutral" onClick={() => void vm.copiar()}>Copiar código</button><span>{vm.sala.participantes.length}/6 en la sala</span><button className="neutral" disabled={!vm.lista} onClick={() => void vm.salir()}>Salir de la sala</button></div>
      <div className="encuentroGrid"><section className="panel encuentroEscenario"><div className="encuentroCanvas"><EscenaEncuentro participantes={vm.sala.participantes} /></div><div className="encuentroAcciones"><span>Tu movimiento lo ven todos.</span>{([ ["Reposo", "Relax"], ["Saludar", "Saludar"], ["Bailar", "Bailar"] ] as const).map(([movimiento, nombre]) => <button key={movimiento} className="neutral" disabled={!vm.lista} onClick={() => void vm.actuar(movimiento)}>{nombre}</button>)}</div><ul className="encuentroParticipantes" aria-label="Parceros en la sala">{vm.sala.participantes.map((p) => <li key={p.usuarioId}><span className="liveDot" />{p.nombreVisible} <small>{p.movimiento === "Bailar" ? "Bailando" : p.movimiento === "Saludar" ? "Saludando" : "En el parche"}</small></li>)}</ul></section>
      <ChatSala mensajes={vm.sala.mensajes} texto={vm.texto} cambiarTexto={vm.setTexto} enviar={vm.enviar} habilitado={vm.lista} /></div>
    </>}
    <p className="encuentroNota">Los mensajes son temporales: se conservan los últimos 100 mientras la sala esté activa. La sala desaparece cuando todos salen o se reinicia el servidor. <Link href="/">Personaliza tu avatar</Link> antes de entrar.</p>
  </main>;
}
