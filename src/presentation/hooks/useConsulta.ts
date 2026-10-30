import { useEffect, useState } from "react";
import { useAlerta } from "../providers/Alertas";
export function useConsulta<T>(cargar: () => Promise<T>) {
  const [revision, actualizar] = useState(0);
  const [resultado, guardar] = useState<{
    cargar: typeof cargar;
    revision: number;
    datos?: T;
  }>();
  const avisar = useAlerta();
  useEffect(() => {
    let activo = true;
    cargar()
      .then((datos) => {
        if (activo) guardar({ cargar, revision, datos });
      })
      .catch((e) => {
        if (activo) {
          guardar({ cargar, revision });
          avisar(
            e instanceof Error ? e.message : "No pudimos cargar los datos.",
          );
        }
      });
    return () => {
      activo = false;
    };
  }, [cargar, revision, avisar]);
  const listo = resultado?.cargar === cargar && resultado.revision === revision;
  return {
    datos: listo ? resultado.datos : undefined,
    cargando: !listo,
    recargar: () => actualizar((r) => r + 1),
  };
}
