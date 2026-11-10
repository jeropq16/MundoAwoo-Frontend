"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Parcero } from "@/domain/entities/encuentro";
import { aparienciaInicial } from "@/domain/entities/avatar3d";
import { Personaje } from "../avatar3d/Personaje";
import { LimiteVisor } from "../avatar3d/Visor3D";
import { recurso3D } from "../avatar3d/recursos3d";
import { NombreParcero } from "./NombreParcero";

export default function EscenaEncuentro({ participantes }: { participantes: Parcero[] }) {
  return (
    <LimiteVisor>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 3.5, 7.5], fov: 48 }} aria-label="Sala 3D con tus parceros" fallback={<p>Tu navegador necesita WebGL para mostrar la sala.</p>}>
        <color attach="background" args={["#191b20"]} />
        <ambientLight intensity={1.5} />
        <hemisphereLight args={["#eee7ff", "#6d6357", 1.5]} />
        <directionalLight position={[3, 6, 4]} intensity={3} />
        <pointLight position={[-3, 3, 1]} intensity={18} color="#ef343e" />
        {participantes.map((parcero, indice) => {
          const avatar = parcero.avatar;
          const queen = avatar.personaje3D === "queen";
          const chaqueta = avatar.itemsEquipados.some((p) => p.ranura === "Torso" && recurso3D(p)) || (queen ? avatar.chaquetaQueen : avatar.chaquetaGhetto);
          const columnas = Math.min(participantes.length, 3);
          return <group key={parcero.usuarioId} position={[(indice % 3 - (columnas - 1) / 2) * 1.6, 0, Math.floor(indice / 3) * -2]}>
            <Personaje personaje={avatar.personaje3D} apariencia={(queen ? avatar.aparienciaQueen : avatar.aparienciaGhetto) ?? aparienciaInicial(avatar.personaje3D)} chaqueta={chaqueta} piezas={avatar.itemsEquipados} movimiento={parcero.movimiento} pausa={!parcero.conectado} />
            <NombreParcero nombre={parcero.nombreVisible} />
          </group>;
        })}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.04, -1]}>
          <circleGeometry args={[4.5, 64]} /><meshStandardMaterial color="#30343b" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.03, -1]}>
          <ringGeometry args={[4.35, 4.4, 64]} /><meshStandardMaterial color="#ef343e" emissive="#ef343e" emissiveIntensity={.5} />
        </mesh>
        <OrbitControls makeDefault target={[0, 1, -.5]} enablePan={false} minDistance={4} maxDistance={12} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </LimiteVisor>
  );
}
