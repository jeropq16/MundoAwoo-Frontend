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

export const cortesPelo = {
  original: "Clásico del personaje",
  rapado: "Rapado",
  fade: "Fade alto",
  trenzas: "Trenzas",
  cresta: "Cresta",
} as const;
export const estilosBarba = {
  original: "Clásica del personaje",
  afeitado: "Sin barba",
  candado: "Candado",
  completa: "Barba completa",
  bigote: "Bigote",
} as const;
export const estilosTatuajes = {
  ninguno: "Sin tatuajes",
  geometrico: "Geométricos",
  estrellas: "Estrellas",
  blackwork: "Blackwork",
} as const;
export type Apariencia3D = {
  pelo: keyof typeof cortesPelo;
  barba: keyof typeof estilosBarba;
  tatuajes: keyof typeof estilosTatuajes;
  colorCabello: string;
};
export function aparienciaInicial(personaje: Personaje3D): Apariencia3D {
  return { pelo: "original", barba: "original", tatuajes: "ninguno", colorCabello: personajes3D[personaje].cabello };
}
