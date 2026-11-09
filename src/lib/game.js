import fallbackCountries from "../mocks/data.json";
import { clearAuth, getAuthHeaders } from "./auth.js";
import { TOTAL_ROUNDS } from "./constants.js";
import { API_BASE_URL } from "./constants.js";
import { shuffle } from "./shufle.js";

export async function fetchCountries() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/countries/`, {
      headers: getAuthHeaders(),
    });

    if (response.status === 401) {
      clearAuth();
      throw new AuthError("La sesión ha expirado.");
    }

    if (!response.ok) throw new Error("No fue posible consultar los países.");

    const data = await response.json();
    if (Array.isArray(data) && data.length >= TOTAL_ROUNDS) return data;
    throw new Error("La API no devolvió suficientes países.");
  } catch (error) {
    if (error instanceof AuthError) throw error;
    console.warn("API de países inaccesible, recurriendo al respaldo local.", error);
  }
  return fallbackCountries;
}

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
      title: "Maestro de Atlas · Rigor Absoluto",
      summary: "¡Precisión impecable! Dominas con total exactitud las capitales del mundo.",
    };
  }
  if (score >= 7) {
    return {
      title: "Expedicionario Avanzado",
      summary: "Excelente conocimiento geodésico y memoria territorial.",
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
