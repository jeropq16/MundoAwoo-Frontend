import { cortesPelo, estilosBarba, estilosTatuajes, personajes3D, type Apariencia3D, type Personaje3D } from "@/domain/entities/avatar3d";

type Props = {
  apariencia: Apariencia3D;
  personaje: Personaje3D;
  ocupado: boolean;
  conGorra: boolean;
  conChaqueta: boolean;
  verRostro: () => void;
  cambiar: (cambios: Partial<Apariencia3D>) => Promise<void>;
};
const colores = [
  ["#201813", "Negro"], ["#5B3825", "Castaño"], ["#D5B36A", "Rubio"],
  ["#A63032", "Rojo"], ["#C5C5CD", "Plateado"],
] as const;

export function Personalizacion({ apariencia, personaje, ocupado, conGorra, conChaqueta, cambiar, verRostro }: Props) {
  return (
    <section className="panel appearanceTools" aria-labelledby="appearance-title">
      <div><p className="eyebrow">TU SELLO PERSONAL</p><h2 id="appearance-title">PELO, BARBA Y TINTA.</h2><p className="appearanceOwner">Estilo de {personajes3D[personaje].nombre}</p></div>
      <button className="neutral" type="button" onClick={verRostro}>Ver detalle del rostro ↗</button>
      <label>Corte de pelo
        <select value={apariencia.pelo} disabled={ocupado} onChange={(e) => void cambiar({ pelo: e.target.value as Apariencia3D["pelo"] })}>
          {Object.entries(cortesPelo).map(([valor, nombre]) => <option key={valor} value={valor}>{nombre}</option>)}
        </select>
      </label>
      {conGorra && <p className="appearanceHint">Quita la gorra en el vestidor para ver el corte de pelo.</p>}
      <label>Barba
        <select value={apariencia.barba} disabled={ocupado} onChange={(e) => void cambiar({ barba: e.target.value as Apariencia3D["barba"] })}>
          {Object.entries(estilosBarba).map(([valor, nombre]) => <option key={valor} value={valor}>{nombre}</option>)}
        </select>
      </label>
      <fieldset className="hairColors"><legend>Color del pelo y la barba</legend>
        <div className="swatches">{colores.map(([color, nombre]) => <button type="button" key={color} disabled={ocupado} aria-label={`Color de pelo ${nombre}`} aria-pressed={apariencia.colorCabello.toLowerCase() === color.toLowerCase()} style={{ background: color }} onClick={() => void cambiar({ colorCabello: color })} />)}</div>
      </fieldset>
      <label>Tatuajes
        <select value={apariencia.tatuajes} disabled={ocupado} onChange={(e) => void cambiar({ tatuajes: e.target.value as Apariencia3D["tatuajes"] })}>
          {Object.entries(estilosTatuajes).map(([valor, nombre]) => <option key={valor} value={valor}>{nombre}</option>)}
        </select>
      </label>
      <p className="appearanceHint">{conChaqueta ? "La chaqueta cubre los tatuajes de los brazos. Quítala para verlos completos." : "Los tatuajes se aplican al cuello y a los brazos."} Cada personaje conserva su propia selección.</p>
    </section>
  );
}
