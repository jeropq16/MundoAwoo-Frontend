import { obtenerTokenVigente } from "./sesion";

// Comparte la renovación coordinada con las peticiones HTTP de la aplicación.
export const tokenEncuentro = obtenerTokenVigente;
