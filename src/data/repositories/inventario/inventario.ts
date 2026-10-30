import { privada } from "@/security/sesion";
import type { Desbloqueo } from "@/domain/entities/mundo";
export const inventario = () => privada<Desbloqueo[]>("inventario");
