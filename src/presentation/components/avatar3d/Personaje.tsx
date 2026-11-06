import { personajes3D, type Personaje3D, type Movimiento3D, type Apariencia3D } from "@/domain/entities/avatar3d";
import { Aro, Segmento, Volumen } from "./Formas";
import { useBaile } from "./useBaile";
import { Pelo3D, Barba3D, useTinta } from "./Apariencia";

import type { Equipado } from "@/domain/entities/mundo";
import { recurso3D } from "./recursos3d";
type Props = { personaje: Personaje3D; chaqueta: boolean; movimiento: Movimiento3D; pausa: boolean; piezas: Equipado[]; apariencia: Apariencia3D };
export function Personaje({ personaje, chaqueta, movimiento, pausa, piezas, apariencia }: Props) {
  const raiz = useBaile(movimiento, pausa);
  const modelos = new Set(piezas.map(recurso3D));
  const queen = personaje === "queen";
  const { piel, acento } = personajes3D[personaje];
  const cabello = apariencia.colorCabello;
  const tinta = useTinta(apariencia.tatuajes);
  const hombro = queen ? 0.19 : 0.23;
  const pantalon = modelos.has("pantalon") ? acento : "#343946";
  const zapatillas = modelos.has("zapatillas") ? acento : "#efe9db";
  const torso = chaqueta ? "#242936" : "#e8e2d3";
  return (
    <group ref={raiz}>
      <Volumen
        posicion={[0, 0.82, 0]}
        escala={[queen ? 0.205 : 0.19, 0.15, 0.135]}
        color={pantalon}
      />
      <Volumen
        posicion={[0, 1.12, 0]}
        escala={[hombro, 0.29, 0.135]}
        color={torso}
      />
      {chaqueta && (
        <group>
          <Volumen
            posicion={[0, 0.92, 0]}
            escala={[hombro, 0.065, 0.14]}
            color={acento}
          />
          <Volumen
            posicion={[0, 1.38, 0]}
            escala={[0.105, 0.035, 0.095]}
            color={acento}
          />
          <mesh position={[0, 1.15, 0.137]}>
            <boxGeometry args={[0.008, 0.36, 0.012]} />
            <meshStandardMaterial
              color="#c3beb2"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0.1, 1.25, 0.12]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.065, 0.065, 0.028]} />
            <meshStandardMaterial color={acento} />
          </mesh>
        </group>
      )}
      <Volumen
        posicion={[0, 1.43, 0]}
        escala={[0.075, 0.09, 0.075]}
        tinta={tinta}
        color={piel}
      />
      <group position={[0, 1.65, 0]}>
        {modelos.has("gorra") && <group position={[0, .1, 0]}>
          <mesh castShadow><sphereGeometry args={[.224, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#252a30" /></mesh>
          <Volumen posicion={[0, .005, .17]} escala={[.22, .02, .17]} color={acento} />
        </group>}
        {modelos.has("lentes") && <group position={[0, .01, .194]}>
          {[-1, 1].map((lado) => <group key={lado} position={[lado * .075, 0, 0]}>
            <mesh castShadow><boxGeometry args={[.116, .065, .025]} /><meshStandardMaterial color="#1c1821" metalness={.4} roughness={.15} /></mesh>
            <mesh position={[0, .03, .014]}><boxGeometry args={[.12, .008, .008]} /><meshStandardMaterial color="#dfbf74" metalness={.8} roughness={.2} /></mesh>
          </group>)}
          <mesh><boxGeometry args={[.045, .012, .018]} /><meshStandardMaterial color="#dfbf74" /></mesh>
        </group>}
        <Volumen escala={[queen ? 0.197 : 0.21, 0.245, 0.19]} color={piel} />
        <Volumen
          posicion={[0, -0.125, 0.06]}
          escala={[0.135, 0.105, 0.125]}
          color={piel}
        />
        {!modelos.has("gorra") && <Pelo3D estilo={apariencia.pelo} personaje={personaje} color={cabello} />}
        <Barba3D estilo={apariencia.barba} personaje={personaje} color={cabello} />
        {queen && [-1, 1].map((lado) => <Aro key={lado} posicion={[lado * .215, -.11, .025]} radio={.04} color="#ebc477" />)}
        {[-1, 1].map((lado) => (
          <group key={lado}>
            <Volumen
              posicion={[lado * 0.202, -0.015, 0]}
              escala={[0.035, 0.06, 0.04]}
              color={piel}
            />
            <Volumen
              posicion={[lado * 0.075, 0.01, 0.174]}
              escala={[0.044, 0.025, 0.018]}
              color="#fff4e1"
            />
            <Volumen
              posicion={[lado * 0.075, 0.009, 0.19]}
              escala={[0.016, 0.021, 0.009]}
              color="#30201a"
            />
            <Volumen
              posicion={[lado * 0.069, 0.016, 0.199]}
              escala={[0.005, 0.006, 0.003]}
              color="#ffffff"
            />
            <Volumen
              posicion={[lado * 0.075, 0.055, 0.173]}
              escala={[0.047, 0.01, 0.015]}
              color={cabello}
            />
          </group>
        ))}
        <Volumen
          posicion={[0, -0.04, 0.188]}
          escala={[0.033, 0.043, 0.04]}
          color={piel}
        />
        <Volumen
          posicion={[0, -0.105, 0.185]}
          escala={[0.044, 0.012, 0.012]}
          color={queen ? "#8b2944" : "#95554b"}
        />
      </group>
      <Aro posicion={[0, 1.32, 0.13]} radio={0.08} color="#e4c17c" />
      {modelos.has("cadena") && <group><Aro posicion={[0, 1.27, .145]} radio={.1} color="#f1d384" /><Volumen posicion={[0, 1.15, .16]} escala={[.03, .04, .01]} color="#f1d384" /></group>}
      {[-1, 1].map((lado) => (
        <group key={lado}>
          <group name={"brazo" + lado} position={[lado * hombro, 1.35, 0]}>
            <Volumen escala={[0.075, 0.075, 0.075]} color={chaqueta ? torso : piel} />
            <Segmento
              largo={0.3}
              radio={chaqueta ? 0.085 : 0.07}
              tinta={chaqueta ? null : tinta}
              color={chaqueta ? torso : piel}
            />
            <group name={"codo" + lado} position={[0, -0.29, 0]}>
              <Volumen escala={[0.063, 0.063, 0.063]} color={chaqueta ? torso : piel} />
              <Segmento
                largo={0.29}
                radio={chaqueta ? 0.073 : 0.057}
                tinta={chaqueta ? null : tinta}
                color={chaqueta ? torso : piel}
              />
              {chaqueta && (
                <Volumen
                  posicion={[0, -0.25, 0]}
                  escala={[0.074, 0.04, 0.074]}
                  color={acento}
                />
              )}
              <Volumen
                posicion={[0, -0.32, 0]}
                escala={[0.061, 0.085, 0.047]}
                color={piel}
              />
            </group>
          </group>
          <group name={"pierna" + lado} position={[lado * 0.105, 0.82, 0]}>
            <Segmento
              largo={0.36}
              radio={queen ? 0.1 : 0.095}
              color={pantalon}
            />
            <group name={"rodilla" + lado} position={[0, -0.35, 0]}>
              <Volumen escala={[0.076, 0.076, 0.076]} color={pantalon} />
              <Segmento largo={0.35} radio={0.079} color={pantalon} />
              <Volumen
                posicion={[0, -0.37, 0.045]}
                escala={[0.095, 0.065, 0.16]}
                color={zapatillas}
              />
              <Volumen
                posicion={[0, -0.39, 0.055]}
                escala={[0.099, 0.035, 0.165]}
                color="#a9a8a4"
              />
              <Volumen
                posicion={[lado * 0.075, -0.36, 0.055]}
                escala={[0.028, 0.022, 0.09]}
                color={acento}
              />
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}
