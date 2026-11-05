import type { Vector3Tuple } from "three";
type Props = { posicion?: Vector3Tuple; escala?: Vector3Tuple; color: string };
export function Volumen({ posicion, escala, color }: Props) {
  return (
    <mesh position={posicion} scale={escala} castShadow receiveShadow>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}
export function Segmento({
  largo,
  radio,
  color,
}: {
  largo: number;
  radio: number;
  color: string;
}) {
  return (
    <mesh position={[0, -largo / 2, 0]} castShadow>
      <capsuleGeometry
        args={[radio, Math.max(0.01, largo - radio * 2), 6, 12]}
      />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  );
}
export function Aro({
  posicion,
  radio,
  color,
}: {
  posicion: Vector3Tuple;
  radio: number;
  color: string;
}) {
  return (
    <mesh position={posicion} castShadow>
      <torusGeometry args={[radio, 0.007, 8, 24]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.25} />
    </mesh>
  );
}
