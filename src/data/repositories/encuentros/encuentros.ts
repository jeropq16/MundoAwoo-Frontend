import { HubConnectionBuilder, HttpTransportType, LogLevel } from "@microsoft/signalr";
import type { Sala, EstadoConexion } from "@/domain/entities/encuentro";
import type { Movimiento3D } from "@/domain/entities/avatar3d";
import { tokenEncuentro } from "@/security/tokenEncuentro";

export function crearConexionEncuentro(
  recibir: (sala: Sala) => void,
  estado: (estado: EstadoConexion) => void,
  aviso: (mensaje: string) => void,
  perderSala: () => void,
) {
  // Long polling conserva autenticación por cabecera y funciona con el proxy Next.
  // SignalR mantiene el canal en tiempo real sin exponer el JWT en la URL.
  const conexion = new HubConnectionBuilder()
    .withUrl("/api/encuentros", { transport: HttpTransportType.LongPolling, accessTokenFactory: tokenEncuentro })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(LogLevel.None)
    .build();
  let codigo: string | null = null;
  let cerrada = false;
  let entrando = false;
  let pendiente: Sala | null = null;
  const mensajeError = (error: unknown) => {
    const mensaje = error instanceof Error ? error.message : "";
    const marca = "HubException: ";
    return mensaje.includes(marca)
      ? mensaje.split(marca).pop()!
      : "No pudimos completar la acción. Revisa tu conexión e inténtalo de nuevo.";
  };
  async function invocar<T>(metodo: string, ...args: unknown[]) {
    try { return await conexion.invoke<T>(metodo, ...args); }
    catch (error) { throw new Error(mensajeError(error)); }
  }
  conexion.on("SalaActualizada", (sala: Sala) => {
    if (cerrada) return;
    if (entrando) {
      if (!pendiente || sala.revision > pendiente.revision) pendiente = sala;
    } else if (sala.codigo === codigo) recibir(sala);
  });
  conexion.onreconnecting(() => estado("reconectando"));
  conexion.onreconnected(async () => {
    if (cerrada) return;
    try {
      if (codigo) recibir(await invocar<Sala>("UnirseSala", codigo));
    } catch (error) {
      codigo = null;
      perderSala();
      aviso(error instanceof Error ? error.message : "Vuelve a entrar a la sala.");
    }
    estado("conectado");
  });
  conexion.onclose(() => { if (!cerrada) estado("desconectado"); });
  return {
    async conectar() {
      estado("conectando");
      await conexion.start();
      if (cerrada) { await conexion.stop(); return; }
      estado("conectado");
    },
    async entrar(codigoSala?: string) {
      entrando = true;
      pendiente = null;
      try {
        const sala = codigoSala === undefined
          ? await invocar<Sala>("CrearSala")
          : await invocar<Sala>("UnirseSala", codigoSala);
        codigo = sala.codigo;
        const ultima = pendiente as Sala | null;
        recibir(ultima?.codigo === sala.codigo && ultima.revision > sala.revision ? ultima : sala);
      } finally { entrando = false; pendiente = null; }
    },
    async salir() { await invocar("SalirSala"); codigo = null; },
    escribir: (texto: string) => invocar<void>("Escribir", texto),
    actuar: (movimiento: Movimiento3D) => invocar<void>("Actuar", movimiento),
    async cerrar() { cerrada = true; await conexion.stop(); },
  };
}
