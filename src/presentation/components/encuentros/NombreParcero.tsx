import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

// Un letrero dentro de WebGL evita crear raíces de React adicionales por avatar.
export function NombreParcero({ nombre }: { nombre: string }) {
  const textura = useMemo(() => {
    const lienzo = document.createElement("canvas");
    lienzo.width = 512;
    lienzo.height = 96;
    const dibujo = lienzo.getContext("2d")!;
    dibujo.fillStyle = "#111210e6";
    dibujo.fillRect(0, 0, 512, 96);
    dibujo.fillStyle = "#f1eee6";
    dibujo.font = "bold 32px Arial";
    dibujo.textAlign = "center";
    dibujo.textBaseline = "middle";
    dibujo.fillText(nombre.length > 24 ? nombre.slice(0, 23) + "…" : nombre, 256, 48, 480);
    const imagen = new CanvasTexture(lienzo);
    imagen.colorSpace = SRGBColorSpace;
    return imagen;
  }, [nombre]);
  useEffect(() => () => textura.dispose(), [textura]);
  return <sprite position={[0, 2.2, 0]} scale={[1.5, .28, 1]}><spriteMaterial map={textura} transparent depthTest={false} /></sprite>;
}
