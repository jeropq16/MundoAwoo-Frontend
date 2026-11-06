export type Personaje3D = "ghetto" | "queen";

export const personajes3D = {
  ghetto: {
    nombre: "Ghetto Boy",
    piel: "#b57650",
    cabello: "#201813",
    acento: "#ed484b",
  },
  queen: {
    nombre: "La Ghetto Queen",
    piel: "#9d6145",
    cabello: "#29161c",
    acento: "#a58bfa",
  },
};

export type Movimiento3D = "Reposo" | "Bailar" | "Saludar";
export type Estilo3D = {
  personaje3D: Personaje3D;
  chaquetaGhetto: boolean;
  chaquetaQueen: boolean;
};
