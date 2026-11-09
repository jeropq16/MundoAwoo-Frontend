import { useEffect, useRef } from "react";
import type { MensajeSala } from "@/domain/entities/encuentro";

type Props = { mensajes: MensajeSala[]; texto: string; cambiarTexto: (texto: string) => void; enviar: () => Promise<void>; habilitado: boolean; };
export function ChatSala({ mensajes, texto, cambiarTexto, enviar, habilitado }: Props) {
  const lista = useRef<HTMLDivElement>(null);
  const ultimoId = mensajes.at(-1)?.id;
  useEffect(() => {
    if (lista.current) lista.current.scrollTop = lista.current.scrollHeight;
  }, [mensajes.length, ultimoId]);
  return <section className="panel encuentroChat" aria-labelledby="chat-titulo">
    <div className="encuentroChatTitulo"><p className="eyebrow">LA CONVERSA</p><h2 id="chat-titulo">Chat de la sala</h2><p>Solo lo ven quienes están aquí.</p></div>
    <div ref={lista} className="encuentroMensajes" role="log" aria-label="Mensajes de la sala" aria-live="polite" aria-relevant="additions">
      {mensajes.length === 0 && <p className="encuentroVacio">Rompe el hielo. ¡Saluda a tus parceros!</p>}
      {mensajes.map((mensaje) => <article key={mensaje.id} className="encuentroMensaje"><div><b>{mensaje.nombreVisible}</b><time dateTime={mensaje.enviadoEnUtc}>{new Date(mensaje.enviadoEnUtc).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</time></div><p>{mensaje.texto}</p></article>)}
    </div>
    <form onSubmit={(evento) => { evento.preventDefault(); void enviar(); }}>
      <label htmlFor="mensaje-sala">Tu mensaje</label>
      <textarea id="mensaje-sala" value={texto} onChange={(e) => cambiarTexto(e.target.value)} maxLength={500} rows={2} placeholder="¿Qué más, parcero?" disabled={!habilitado} />
      <div><small>{texto.length}/500</small><button type="submit" disabled={!habilitado || !texto.trim()}>Enviar mensaje</button></div>
    </form>
  </section>;
}
