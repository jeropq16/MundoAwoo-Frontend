export class ApiError extends Error {
  constructor(
    public status: number,
    mensaje: string,
  ) {
    super(mensaje);
  }
}

export async function api<T>(
  ruta: string,
  metodo = "GET",
  datos?: unknown,
  token?: string,
): Promise<T> {
  const headers = new Headers();
  if (datos !== undefined) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch("/api/" + ruta, {
      method: metodo,
      headers,
      body: JSON.stringify(datos),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      0,
      "No pudimos conectar con Mundo Awoo. Revisa tu conexión e inténtalo de nuevo.",
    );
  }
  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    const fallback =
      response.status === 403
        ? "Tu cuenta no tiene permiso para esta acción."
        : "No se pudo completar la solicitud. Inténtalo de nuevo.";
    throw new ApiError(
      response.status,
      (response.status < 500 && problem?.detail) || fallback,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
