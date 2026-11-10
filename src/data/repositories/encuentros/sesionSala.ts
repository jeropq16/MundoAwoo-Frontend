import type { EntradaSala, EstadoConexion, RetornoEncuentro, Sala } from "@/domain/entities/encuentro";
import type { Movimiento3D } from "@/domain/entities/avatar3d";

// El transporte se inyecta para poder probar cortes y respuestas tardías sin una red real.
export interface CanalEncuentro {
  start(): Promise<void>;
  stop(): Promise<void>;
  invoke<T>(metodo: string, ...args: unknown[]): Promise<T>;
  on(evento: string, fn: (sala: Sala) => void): void;
  onreconnecting(fn: () => void): void;
  onreconnected(fn: () => Promise<void>): void;
  onclose(fn: () => void): void;
}
export function crearSesionSala(
  canal: CanalEncuentro,
  recibir: (sala: Sala) => void,
  estado: (estado: EstadoConexion) => void,
  aviso: (mensaje: string) => void,
  perderSala: () => void,
  guardar: (retorno: RetornoEncuentro | null) => void,
  inicial: RetornoEncuentro | null = null,
) {
  let retorno = inicial;
  let cerrada = false;
  let epoca = 0;
  let entrando = false;
  const pendientes = new Map<string, Sala>();
  const vigente = (turno: number) => !cerrada && turno === epoca;
  async function invocar<T>(metodo: string, ...args: unknown[]) {
    try { return await canal.invoke<T>(metodo, ...args); }
    catch (error) {
      const texto = error instanceof Error ? error.message : "";
      const marca = "HubException: ";
      throw new Error(texto.includes(marca) ? texto.split(marca).pop()! : "No pudimos completar la acción. Revisa tu conexión e inténtalo de nuevo.");
    }
  }
  function aplicar(entrada: EntradaSala) {
    retorno = { codigo: entrada.sala.codigo, tokenReconexion: entrada.tokenReconexion };
    guardar(retorno);
    const ultima = pendientes.get(entrada.sala.codigo);
    recibir(ultima && ultima.revision > entrada.sala.revision ? ultima : entrada.sala);
  }
  async function recuperar(turno: number) {
    if (!retorno) { if (vigente(turno)) estado("conectado"); return; }
    entrando = true;
    pendientes.clear();
    estado("reconectando");
    try {
      const entrada = await invocar<EntradaSala>("ReanudarSala", retorno.codigo, retorno.tokenReconexion);
      if (!vigente(turno)) return;
      aplicar(entrada);
      estado("conectado");
    } catch (error) {
      if (!vigente(turno)) return;
      if (error instanceof Error && error.message === "REANUDACION_NO_DISPONIBLE") {
        retorno = null;
        guardar(null);
        perderSala();
        aviso("Tu lugar ya no está disponible: pasaron dos minutos o la sala se cerró. Puedes crear otra o volver a entrar con su código.");
        estado("conectado");
      } else {
        estado("desconectado");
        aviso("No pudimos recuperar la sala. Conservamos el código y tu borrador; pulsa Reconectar para reintentar.");
      }
    } finally {
      if (vigente(turno)) { entrando = false; pendientes.clear(); }
    }
  }
  canal.on("SalaActualizada", (sala) => {
    if (cerrada) return;
    if (entrando) {
      const anterior = pendientes.get(sala.codigo);
      if (!anterior || sala.revision > anterior.revision) pendientes.set(sala.codigo, sala);
    } else if (sala.codigo === retorno?.codigo) recibir(sala);
  });
  canal.onreconnecting(() => {
    if (cerrada) return;
    epoca++;
    entrando = false;
    pendientes.clear();
    estado("reconectando");
  });
  canal.onreconnected(async () => { if (!cerrada) await recuperar(epoca); });
  canal.onclose(() => {
    if (cerrada) return;
    epoca++;
    entrando = false;
    pendientes.clear();
    estado("desconectado");
  });
  return {
    async conectar() {
      const turno = epoca;
      estado(retorno ? "reconectando" : "conectando");
      await canal.start();
      if (!vigente(turno)) return;
      await recuperar(turno);
    },
    async entrar(codigo?: string) {
      if (cerrada || entrando || retorno) throw new Error("Sal de tu sala actual antes de entrar a otra.");
      const turno = epoca;
      entrando = true;
      pendientes.clear();
      try {
        const entrada = codigo === undefined
          ? await invocar<EntradaSala>("CrearSala")
          : await invocar<EntradaSala>("UnirseSala", codigo);
        if (!vigente(turno)) throw new Error("Se interrumpió la entrada a la sala. Reconecta y vuelve a intentarlo.");
        aplicar(entrada);
      } finally { if (vigente(turno)) { entrando = false; pendientes.clear(); } }
    },
    async salir() {
      const turno = epoca;
      await invocar("SalirSala");
      if (!vigente(turno)) throw new Error("Se interrumpió la salida. Reconecta o vuelve a pulsar Salir.");
      epoca++;
      retorno = null;
      guardar(null);
    },
    escribir: (texto: string) => invocar<void>("Escribir", texto),
    actuar: (movimiento: Movimiento3D) => invocar<void>("Actuar", movimiento),
    async cerrar() { cerrada = true; epoca++; await canal.stop(); },
  };
}
