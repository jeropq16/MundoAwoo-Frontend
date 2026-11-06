import type { Texture, Vector3Tuple } from "three";
type Props = { posicion?: Vector3Tuple; escala?: Vector3Tuple; color: string; tinta?: Texture | null };
export function Volumen({ posicion, escala, color, tinta }: Props) {
  return <group position={posicion} scale={escala}>
    <mesh castShadow receiveShadow><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={color} roughness={.65} /></mesh>
    {tinta && <mesh scale={1.002}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial map={tinta} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-2} roughness={1} /></mesh>}
  </group>;
}
export function Segmento({ largo, radio, color, tinta }: { largo: number; radio: number; color: string; tinta?: Texture | null }) {
  const geometria: [number, number, number, number] = [radio, Math.max(.01, largo - radio * 2), 6, 12];
  return <group position={[0, -largo / 2, 0]}>
    <mesh castShadow><capsuleGeometry args={geometria} /><meshStandardMaterial color={color} roughness={.72} /></mesh>
    {tinta && <mesh scale={1.002}><capsuleGeometry args={geometria} /><meshStandardMaterial map={tinta} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-2} roughness={1} /></mesh>}
  </group>;
}
export function Aro({ posicion, radio, color }: { posicion: Vector3Tuple; radio: number; color: string }) {
  return <mesh position={posicion} castShadow><torusGeometry args={[radio, .007, 8, 24]} /><meshStandardMaterial color={color} metalness={.8} roughness={.25} /></mesh>;
}
