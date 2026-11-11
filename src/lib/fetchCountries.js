import { API_BASE_URL } from "./constants";
import { TOTAL_ROUNDS } from "./constants";
import fallbackCountries from "../mocks/data.json";
import { clearAuth, getAuthHeaders } from "./auth.js";

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
