import { HubConnectionBuilder, HttpTransportType, LogLevel } from "@microsoft/signalr";
import { tokenEncuentro } from "@/security/tokenEncuentro";
import { crearSesionSala } from "./sesionSala";
import type { EstadoConexion, RetornoEncuentro, Sala } from "@/domain/entities/encuentro";

export function crearConexionEncuentro(
  recibir: (sala: Sala) => void,
  estado: (estado: EstadoConexion) => void,
  aviso: (mensaje: string) => void,
  perderSala: () => void,
  guardar: (retorno: RetornoEncuentro | null) => void,
  inicial: RetornoEncuentro | null = null,
) {
  // Long polling lleva el JWT por cabecera. El retorno privado tampoco viaja en la URL.
  const conexion = new HubConnectionBuilder()
    .withUrl("/api/encuentros", { transport: HttpTransportType.LongPolling, accessTokenFactory: tokenEncuentro })
    .withAutomaticReconnect({ nextRetryDelayInMilliseconds: ({ elapsedMilliseconds, previousRetryCount }) =>
      elapsedMilliseconds >= 110_000 ? null : [0, 2000, 5000][previousRetryCount] ?? 10_000 })
    .configureLogging(LogLevel.None)
    .build();
  return crearSesionSala(conexion, recibir, estado, aviso, perderSala, guardar, inicial);
}
