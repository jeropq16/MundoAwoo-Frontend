import { useState, useRef, useCallback } from "react";
import { useAlerta } from "../providers/Alertas";
export function useOperacion() {
  const avisar = useAlerta();
  const [ocupado, setOcupado] = useState(false);
  const lock = useRef(false);
  const ejecutar = async (accion: () => Promise<void>) => {
    if (lock.current) return;
    lock.current = true;
    setOcupado(true);
    try {
      await accion();
    } catch (error) {
      avisar(error instanceof Error ? error.message : "Inténtalo de nuevo.");
    } finally {
      lock.current = false;
      setOcupado(false);
    }
  };
  const error = useCallback(
    (e: unknown) =>
      avisar(e instanceof Error ? e.message : "Inténtalo de nuevo."),
    [avisar],
  );
  return { ocupado, ejecutar, avisar, error };
}
