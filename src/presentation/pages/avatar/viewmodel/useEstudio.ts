import { useEffect, useState } from "react";
import type {
  Avatar,
  Categoria,
  Desbloqueo,
  Item,
  Tipo,
} from "@/domain/entities/mundo";
import { avatarRepo } from "@/data/repositories/avatar/avatar";
import { catalogo } from "@/data/repositories/catalogo/catalogo";
import { inventario } from "@/data/repositories/inventario/inventario";
import { useOperacion } from "@/presentation/hooks/useOperacion";
import { armarioMuestra, muestras } from "./muestras";

export function useEstudio(usuario: string | null) {
  const [avatar, setAvatar] = useState<Avatar>({
    id: "",
    usuarioId: "",
    colorFondo: "#aad8d1",
    itemsEquipados: [],
  });
  const [categorias, setCategorias] = useState<Categoria[]>(
    usuario ? [] : muestras,
  );
  const [armario, setArmario] = useState<Desbloqueo[]>(
    usuario ? [] : armarioMuestra,
  );
  const [tipo, seleccionar] = useState<Tipo | "Fondo">("Ropa");
  const [pausa, pausar] = useState(false);
  const [accion, mover] = useState<
    "Equipado" | "Reposo" | "Saludar" | "Bailar"
  >("Equipado");
  const [estado, setEstado] = useState(usuario ? "cargando" : "listo");
  const [intento, reintentar] = useState(0);
  const { error, ejecutar, ocupado } = useOperacion();
  useEffect(() => {
    if (!usuario) return;
    let activo = true;
    Promise.all([avatarRepo.obtener(), catalogo.categorias(), inventario()])
      .then(([a, c, i]) => {
        if (activo) {
          setAvatar(a);
          setCategorias(c);
          setArmario(i);
          setEstado("listo");
        }
      })
      .catch((e) => {
        if (activo) {
          setEstado("error");
          error(e);
        }
      });
    return () => {
      activo = false;
    };
  }, [usuario, error, intento]);
  const elegir = (item: Item) =>
    ejecutar(async () => {
      const quitar = avatar.itemsEquipados.some(
        (p) => p.itemDeAvatarId === item.id,
      );
      const anterior = avatar.itemsEquipados.find(
        (p) => p.ranura === item.ranura,
      );
      if (!quitar && anterior)
        throw new Error(
          "Quita primero " + anterior.nombre + " para liberar esta ranura.",
        );
      if (usuario && !quitar) setAvatar(await avatarRepo.equipar(item.id));
      else {
        if (usuario) await avatarRepo.quitar(item.id);
        const piezas = avatar.itemsEquipados.filter(
          (p) => p.ranura !== item.ranura,
        );
        if (!quitar) piezas.push({ ...item, itemDeAvatarId: item.id });
        setAvatar({ ...avatar, itemsEquipados: piezas });
      }
      if (item.ranura === "Animacion") {
        mover("Equipado");
        pausar(false);
      }
    });
  const color = (colorFondo: string) =>
    ejecutar(async () =>
      setAvatar(
        usuario
          ? await avatarRepo.color(colorFondo)
          : { ...avatar, colorFondo },
      ),
    );
  const ids = categorias.filter((c) => c.tipo === tipo).map((c) => c.id);
  const piezas = armario.filter((p) => ids.includes(p.item.categoriaId));
  const animacion = avatar.itemsEquipados.find((p) => p.ranura === "Animacion");
  const categoriaAnimacion = armario.find(
    ({ item }) => item.id === animacion?.itemDeAvatarId,
  )?.item.categoriaId;
  let movimiento = accion === "Equipado" ? "Reposo" : accion;
  if (animacion && accion === "Equipado")
    movimiento =
      categorias.find((c) => c.id === categoriaAnimacion)?.tipo === "Baile"
        ? "Bailar"
        : "Saludar";
  return {
    avatar,
    piezas,
    tipo,
    seleccionar,
    elegir,
    color,
    pausa,
    pausar,
    movimiento,
    mover: (a: typeof accion) => {
      mover(a);
      pausar(false);
    },
    ocupado,
    estado,
    reintentar: () => {
      setEstado("cargando");
      reintentar((i) => i + 1);
    },
  };
}
