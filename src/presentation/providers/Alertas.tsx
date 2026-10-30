"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
const Contexto = createContext<(mensaje: string) => void>(() => {});
export const useAlerta = () => useContext(Contexto);
export function Alertas({ children }: { children: React.ReactNode }) {
  const [alerta, setAlerta] = useState<{ mensaje: string } | null>(null);
  const avisar = useCallback((mensaje: string) => setAlerta({ mensaje }), []);
  useEffect(() => {
    if (!alerta) return;
    const timer = setTimeout(() => setAlerta(null), 8000);
    return () => clearTimeout(timer);
  }, [alerta]);
  return (
    <Contexto.Provider value={avisar}>
      {children}
      {alerta && (
        <div className="toast" role="alert">
          {alerta.mensaje}
          <button aria-label="Cerrar aviso" onClick={() => setAlerta(null)}>
            ×
          </button>
        </div>
      )}
    </Contexto.Provider>
  );
}
