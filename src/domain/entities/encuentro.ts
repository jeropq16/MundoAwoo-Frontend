import type { Avatar } from "./mundo";
import type { Movimiento3D } from "./avatar3d";

export interface Parcero {
  usuarioId: string;
  nombreVisible: string;
  avatar: Avatar;
  movimiento: Movimiento3D;
  conectado: boolean;
}
export interface MensajeSala {
  id: string;
  usuarioId: string;
  nombreVisible: string;
  texto: string;
  enviadoEnUtc: string;
}
export interface Sala {
  codigo: string;
  revision: number;
  participantes: Parcero[];
  mensajes: MensajeSala[];
}
export type EstadoConexion = "conectando" | "conectado" | "reconectando" | "desconectado";

export interface RetornoEncuentro { codigo: string; tokenReconexion: string; }
export interface EntradaSala { sala: Sala; tokenReconexion: string; }
