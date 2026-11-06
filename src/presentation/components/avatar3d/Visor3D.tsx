"use client";
import { Component, useEffect, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Personaje } from "./Personaje";
import type { Personaje3D, Movimiento3D } from "@/domain/entities/avatar3d";

type Props = {
  personaje: Personaje3D;
  chaqueta: boolean;
  movimiento: Movimiento3D;
  pausa: boolean;
  colorFondo: string;
  piezas: import("@/domain/entities/mundo").Equipado[];
  camara: { angulo: number; revision: number };
};
function Camara({ angulo }: { angulo: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(Math.sin(angulo) * 3.8, 1.65, Math.cos(angulo) * 3.8);
    camera.lookAt(0, 1, 0);
    camera.updateProjectionMatrix();
  }, [camera, angulo]);
  return (
    <OrbitControls
      makeDefault
      target={[0, 1, 0]}
      enablePan={false}
      minDistance={2.4}
      maxDistance={5.5}
      minPolarAngle={0.4}
      maxPolarAngle={Math.PI / 2 + 0.1}
    />
  );
}
class LimiteVisor extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error)
      return (
        <div className="labFallback" role="alert">
          <p>
            No pudimos iniciar el visor 3D. Comprueba que tu navegador tenga
            aceleración gráfica.
          </p>
          <button onClick={() => this.setState({ error: false })}>
            Reintentar visor
          </button>
        </div>
      );
    return this.props.children;
  }
}
export default function Visor3D(props: Props) {
  return (
    <LimiteVisor>
      <Canvas
        shadows="percentage"
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.65, 3.8], fov: 38 }}
        fallback={<p>Este navegador necesita WebGL para mostrar el avatar.</p>}
        aria-label="Escena 3D interactiva"
      >
        <color attach="background" args={["#191b20"]} />
        <ambientLight intensity={1.2} />
        <hemisphereLight args={["#eee7ff", "#6d6357", 1.5]} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={3}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
          shadow-normalBias={0.03}
        />
        <pointLight
          position={[-2, 2, -2]}
          intensity={12}
          color={props.colorFondo}
        />
        <Personaje
          personaje={props.personaje}
          chaqueta={props.chaqueta}
          movimiento={props.movimiento}
          pausa={props.pausa}
          piezas={props.piezas}
        />
        <mesh position={[0, -0.035, 0]} receiveShadow>
          <cylinderGeometry args={[0.85, 0.88, 0.08, 64]} />
          <meshStandardMaterial color="#30343f" roughness={0.65} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
          <ringGeometry args={[0.79, 0.805, 64]} />
          <meshStandardMaterial
            color={props.colorFondo}
            emissive={props.colorFondo}
            emissiveIntensity={0.5}
          />
        </mesh>
        <Camara key={props.camara.revision} angulo={props.camara.angulo} />
      </Canvas>
    </LimiteVisor>
  );
}
