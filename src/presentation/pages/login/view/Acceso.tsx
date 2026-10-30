"use client";
import Link from "next/link";
import { useAcceso } from "../viewmodel/useAcceso";
export function Acceso({ registro = false }: { registro?: boolean }) {
  const vm = useAcceso(registro);
  return (
    <main className="narrow">
      <p className="eyebrow">MUNDO AWOO / CUENTA</p>
      <h1>
        {registro ? "Crea tu cuenta" : "Bienvenido al claro"}
        <span>.</span>
      </h1>
      <p>Guarda el vestuario y el escenario de tu avatar.</p>
      <form
        className="panel form"
        onSubmit={(e) => {
          e.preventDefault();
          void vm.enviar(new FormData(e.currentTarget));
        }}
      >
        {registro && (
          <label>
            Nombre visible
            <input
              name="nombreVisible"
              autoComplete="nickname"
              maxLength={50}
              required
            />
          </label>
        )}
        <label>
          Correo
          <input
            type="email"
            name="correo"
            autoComplete="email"
            maxLength={256}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            name="contrasena"
            autoComplete={registro ? "new-password" : "current-password"}
            minLength={registro ? 12 : 1}
            maxLength={128}
            required
          />
        </label>
        {registro && (
          <small>
            Usa al menos 12 caracteres, con mayúscula, minúscula, número y
            símbolo.
          </small>
        )}
        <button className="primary" disabled={vm.ocupado}>
          {registro ? "Crear cuenta" : "Iniciar sesión"}
        </button>
        <Link href={registro ? "/login" : "/registro"}>
          {registro ? "Ya tengo una cuenta" : "Crear una cuenta nueva"}
        </Link>
      </form>
    </main>
  );
}
