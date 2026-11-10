import { useEffect, useRef, useState } from "react";
import { crearConexionEncuentro } from "@/data/repositories/encuentros/encuentros";
import type { EstadoConexion, RetornoEncuentro, Sala } from "@/domain/entities/encuentro";
import type { Movimiento3D } from "@/domain/entities/avatar3d";
import { useOperacion } from "@/presentation/hooks/useOperacion";

import { useUsuario } from "@/security/useUsuario";
import { guardarRetornoEncuentro, leerRetornoEncuentro } from "@/security/retornoEncuentro";

export function useEncuentro() {
  const usuario = useUsuario();
  const retorno = useRef<RetornoEncuentro | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [estado, setEstado] = useState<EstadoConexion>("conectando");
  const [codigo, setCodigo] = useState("");
  const [texto, setTexto] = useState("");
  const [intento, setIntento] = useState(0);
  const conexion = useRef<ReturnType<typeof crearConexionEncuentro> | null>(null);
  const { ejecutar, ocupado, avisar } = useOperacion();

  useEffect(() => {
    if (!usuario) return;
    let activo = true;
    retorno.current ??= leerRetornoEncuentro(usuario);
    const cliente = crearConexionEncuentro(
      (nueva) => {
        if (!activo) return;
        setCodigo(nueva.codigo);
        setSala((anterior) => anterior?.codigo === nueva.codigo && anterior.revision > nueva.revision ? anterior : nueva);
      },
      (nuevo) => { if (activo) setEstado(nuevo); },
      (aviso) => { if (activo) avisar(aviso); },
      () => { if (activo) setSala(null); },
      (nuevo) => {
        if (!activo) return;
        retorno.current = nuevo;
        guardarRetornoEncuentro(usuario, nuevo);
      },
      retorno.current,
    );
    conexion.current = cliente;
    cliente.conectar().catch(() => {
      if (activo) { setEstado("desconectado"); avisar("No pudimos conectar con el encuentro. Pulsa Reconectar."); }
    });
    return () => { activo = false; conexion.current = null; void cliente.cerrar().catch(() => {}); };
  }, [intento, avisar, usuario]);

  const lista = estado === "conectado" && !ocupado;
  return {
    sala, estado, codigo, setCodigo, texto, setTexto, lista, ocupado,
    crear: () => ejecutar(async () => { await conexion.current?.entrar(); }),
    unirse: () => ejecutar(async () => {
      if (!/^[A-F0-9]{12}$/i.test(codigo.trim())) throw new Error("Escribe los 12 caracteres del código de la sala.");
      await conexion.current?.entrar(codigo.trim().toUpperCase());
    }),
    salir: () => ejecutar(async () => {
      if (estado === "conectado") await conexion.current?.salir();
      else {
        void conexion.current?.cerrar().catch(() => {});
        retorno.current = null;
        if (usuario) guardarRetornoEncuentro(usuario, null);
        setIntento((valor) => valor + 1);
      }
      setSala(null);
      setTexto("");
    }),
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
    reconectar: () => { setIntento((valor) => valor + 1); },
  };
}
