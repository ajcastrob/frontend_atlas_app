import { TOTAL_ROUNDS } from "./constants.js";
import { shuffle } from "./shufle.js";

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

export function makeQuestions(countries) {
  return shuffle(countries)
    .slice(0, TOTAL_ROUNDS)
    .map((country, index) => {
      const sameRegion = countries
        .filter((item) => item.capital !== country.capital && item.region === country.region)
        .map((item) => item.capital);
      const otherRegions = countries
        .filter((item) => item.capital !== country.capital && item.region !== country.region)
        .map((item) => item.capital);

      return {
        country,
        options: shuffle([
          country.capital,
          ...shuffle([...sameRegion, ...otherRegions]).slice(0, 3),
        ]),
        selectedOption: null,
        confirmed: false,
        isCorrect: null,
        passed: false,
        fichaNumber: `FICHA ${String(index + 1).padStart(3, "0")}`,
      };
    });
}

export function getResultCopy(score) {
  if (score === TOTAL_ROUNDS) {
    return {
      title: "Maestro de Atlas",
      summary: "¡Impecable! Dominas con exactitud las capitales del mundo.",
    };
  }
  if (score >= 7) {
    return {
      title: "Expedicionario Avanzado",
      summary: "Excelente conocimiento y memoria territorial.",
    };
  }
  if (score >= 4) {
    return {
      title: "Explorador Geográfico",
      summary: "Buen recorrido, aunque varias fichas requieren mayor estudio.",
    };
  }
  return {
    title: "Aprendiz de Rutas",
    summary: "Has dado tus primeros pasos en el compendio cartográfico.",
  };
}
