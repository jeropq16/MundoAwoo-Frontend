"use client";
import { useSyncExternalStore } from "react";
import { observarSesion, leerSesion } from "./sesion";
export function useUsuario() {
  return useSyncExternalStore(
    observarSesion,
    () => leerSesion()?.usuarioId ?? null,
    () => null,
  );
}
