import { useEffect, useRef, useState } from "react";
import { crearConexionEncuentro } from "@/data/repositories/encuentros/encuentros";
import type { EstadoConexion, Sala } from "@/domain/entities/encuentro";
import type { Movimiento3D } from "@/domain/entities/avatar3d";
import { useOperacion } from "@/presentation/hooks/useOperacion";

export function useEncuentro() {
  const [sala, setSala] = useState<Sala | null>(null);
  const [estado, setEstado] = useState<EstadoConexion>("conectando");
  const [codigo, setCodigo] = useState("");
  const [texto, setTexto] = useState("");
  const [intento, setIntento] = useState(0);
  const conexion = useRef<ReturnType<typeof crearConexionEncuentro> | null>(null);
  const { ejecutar, ocupado, avisar } = useOperacion();

  useEffect(() => {
    let activo = true;
    const cliente = crearConexionEncuentro(
      (nueva) => { if (activo) setSala((anterior) => anterior?.codigo === nueva.codigo && anterior.revision > nueva.revision ? anterior : nueva); },
      (nuevo) => { if (activo) setEstado(nuevo); },
      (aviso) => { if (activo) avisar(aviso); },
      () => { if (activo) setSala(null); },
    );
    conexion.current = cliente;
    cliente.conectar().catch(() => {
      if (activo) { setEstado("desconectado"); avisar("No pudimos conectar con el encuentro. Pulsa Reconectar."); }
    });
    return () => { activo = false; conexion.current = null; void cliente.cerrar(); };
  }, [intento, avisar]);

  const lista = estado === "conectado" && !ocupado;
  return {
    sala, estado, codigo, setCodigo, texto, setTexto, lista, ocupado,
    crear: () => ejecutar(async () => { await conexion.current?.entrar(); }),
    unirse: () => ejecutar(async () => {
      if (!/^[A-F0-9]{12}$/i.test(codigo.trim())) throw new Error("Escribe los 12 caracteres del código de la sala.");
      await conexion.current?.entrar(codigo.trim().toUpperCase());
    }),
    salir: () => ejecutar(async () => { await conexion.current?.salir(); setSala(null); setTexto(""); }),
    enviar: () => ejecutar(async () => {
      if (!texto.trim()) return;
      await conexion.current?.escribir(texto.trim());
      setTexto("");
    }),
    actuar: (movimiento: Movimiento3D) => ejecutar(async () => { await conexion.current?.actuar(movimiento); }),
    copiar: () => ejecutar(async () => {
      if (!sala) return;
      try { await navigator.clipboard.writeText(sala.codigo); avisar("Código copiado. Compártelo con tu parcero."); }
      catch { avisar("Selecciona el código de la sala y cópialo para compartirlo."); }
    }),
    reconectar: () => { setSala(null); setIntento((valor) => valor + 1); },
  };
}
