import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

async function cargar(ruta) {
  const fuente = await readFile(new URL(ruta, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(fuente, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}
const { crearSesionSala } = await cargar("../src/data/repositories/encuentros/sesionSala.ts");
const { leerRetornoEncuentro, guardarRetornoEncuentro } = await cargar("../src/security/retornoEncuentro.ts");
const retorno = { codigo: "ABCDEF123456", tokenReconexion: "A".repeat(64) };
const sala = (revision = 1, codigo = retorno.codigo) => ({ codigo, revision, participantes: [], mensajes: [] });
const entrada = (revision = 1) => ({ sala: sala(revision), tokenReconexion: retorno.tokenReconexion });
const pendiente = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => { resolve = a; reject = b; });
  return { promise, resolve, reject };
};
function escenario(inicial = null) {
  const estados = [], salas = [], avisos = [], guardados = [], llamadas = [];
  let perdidas = 0;
  const canal = {
    start: async () => {}, stop: async () => {},
    invoke: async (metodo, ...args) => { llamadas.push([metodo, ...args]); return canal.responder(metodo, ...args); },
    responder: async () => entrada(),
    on: (_, fn) => { canal.evento = fn; },
    onreconnecting: (fn) => { canal.corte = fn; },
    onreconnected: (fn) => { canal.regreso = fn; },
    onclose: (fn) => { canal.fin = fn; },
  };
  const cliente = crearSesionSala(canal, s => salas.push(s), e => estados.push(e), a => avisos.push(a), () => perdidas++, r => guardados.push(r), inicial);
  return { canal, cliente, estados, salas, avisos, guardados, llamadas, get perdidas() { return perdidas; } };
}

test("el regreso reclama el lugar original y espera confirmación antes de habilitar controles", async () => {
  const e = escenario();
  await e.cliente.conectar();
  await e.cliente.entrar();
  e.canal.corte();
  const respuesta = pendiente();
  e.canal.responder = () => respuesta.promise;
  const regreso = e.canal.regreso();
  assert.equal(e.estados.at(-1), "reconectando");
  assert.deepEqual(e.llamadas.at(-1), ["ReanudarSala", retorno.codigo, retorno.tokenReconexion]);
  e.canal.evento(sala(8));
  respuesta.resolve(entrada(4));
  await regreso;
  assert.equal(e.estados.at(-1), "conectado");
  assert.equal(e.salas.at(-1).revision, 8);
  assert.equal(e.perdidas, 0);
  assert.equal(e.llamadas.filter(([m]) => m === "CrearSala").length, 1);
});

test("un fallo temporal conserva la clave y permite reintentar en una conexión nueva", async () => {
  const e = escenario(retorno);
  e.canal.responder = async () => { throw new Error("network error"); };
  await e.cliente.conectar();
  assert.equal(e.estados.at(-1), "desconectado");
  assert.equal(e.perdidas, 0);
  assert.deepEqual(e.guardados, []);
  const nuevo = escenario(retorno);
  await nuevo.cliente.conectar();
  assert.equal(nuevo.estados.at(-1), "conectado");
  assert.deepEqual(nuevo.llamadas[0], ["ReanudarSala", retorno.codigo, retorno.tokenReconexion]);
});

test("una reserva vencida elimina la clave y permite elegir sala sin crear una automáticamente", async () => {
  const e = escenario(retorno);
  e.canal.responder = async () => { throw new Error("Failed: HubException: REANUDACION_NO_DISPONIBLE"); };
  await e.cliente.conectar();
  assert.equal(e.estados.at(-1), "conectado");
  assert.equal(e.perdidas, 1);
  assert.deepEqual(e.guardados, [null]);
  assert.equal(e.llamadas.length, 1);
  assert.match(e.avisos[0], /dos minutos/);
});

test("cerrar o perder otro transporte invalida respuestas tardías de recuperación", async () => {
  for (const cerrar of [true, false]) {
    const e = escenario(retorno), respuesta = pendiente();
    e.canal.responder = () => respuesta.promise;
    const inicio = e.cliente.conectar();
    await new Promise(resolve => setImmediate(resolve));
    if (cerrar) await e.cliente.cerrar(); else e.canal.corte();
    respuesta.resolve(entrada());
    await inicio;
    assert.deepEqual(e.salas, []);
    assert.deepEqual(e.guardados, []);
    assert.ok(!e.estados.includes("conectado"));
  }
});

test("la entrada ignora eventos de otra sala y toma la revisión más nueva", async () => {
  const e = escenario(), respuesta = pendiente();
  await e.cliente.conectar();
  e.canal.responder = () => respuesta.promise;
  const unir = e.cliente.entrar(retorno.codigo);
  e.canal.evento(sala(4));
  e.canal.evento(sala(999, "000000000000"));
  respuesta.resolve(entrada(2));
  await unir;
  assert.equal(e.salas.at(-1).revision, 4);
  const cantidad = e.salas.length;
  e.canal.evento(sala(1000, "000000000000"));
  assert.equal(e.salas.length, cantidad);
});

test("salir invalida el retorno y una reconexión posterior no reclama la sala abandonada", async () => {
  const e = escenario(retorno);
  await e.cliente.conectar();
  await e.cliente.salir();
  assert.equal(e.guardados.at(-1), null);
  e.canal.corte();
  await e.canal.regreso();
  assert.deepEqual(e.llamadas.map(([m]) => m), ["ReanudarSala", "SalirSala"]);
});

test("la clave queda aislada por cuenta y tolera almacenamiento bloqueado o corrupto", () => {
  const datos = new Map();
  globalThis.sessionStorage = { getItem: k => datos.get(k) ?? null, setItem: (k,v) => datos.set(k,v), removeItem: k => datos.delete(k) };
  guardarRetornoEncuentro("uno", retorno);
  assert.deepEqual(leerRetornoEncuentro("uno"), retorno);
  assert.equal(leerRetornoEncuentro("otro"), null);
  datos.set("awoorld.encuentro.uno", "{roto");
  assert.equal(leerRetornoEncuentro("uno"), null);
  datos.set("awoorld.encuentro.uno", JSON.stringify({ codigo: retorno.codigo, tokenReconexion: "no-valido" }));
  assert.equal(leerRetornoEncuentro("uno"), null);
  globalThis.sessionStorage = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => { throw new Error("blocked"); } };
  assert.equal(leerRetornoEncuentro("uno"), null);
  assert.doesNotThrow(() => guardarRetornoEncuentro("uno", retorno));
  assert.doesNotThrow(() => guardarRetornoEncuentro("uno", null));
  delete globalThis.sessionStorage;
});
