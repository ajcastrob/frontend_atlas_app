import fallbackCountries from "../mocks/data.json"

export const TOTAL_ROUNDS = 10
export const OPTION_LETTERS = ["A", "B", "C", "D"]

export function shuffle(items) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]]
  }
  return copy
}

export async function fetchCountries() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/countries/")
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data) && data.length >= TOTAL_ROUNDS) return data
    }
  } catch (error) {
    console.warn("API de países inaccesible, recurriendo al respaldo local.", error)
  }
  return fallbackCountries
}

export function makeQuestions(countries) {
  return shuffle(countries)
    .slice(0, TOTAL_ROUNDS)
    .map((country, index) => {
      const sameRegion = countries
        .filter((item) => item.capital !== country.capital && item.region === country.region)
        .map((item) => item.capital)
      const otherRegions = countries
        .filter((item) => item.capital !== country.capital && item.region !== country.region)
        .map((item) => item.capital)

      return {
        country,
        options: shuffle([country.capital, ...shuffle([...sameRegion, ...otherRegions]).slice(0, 3)]),
        selectedOption: null,
        confirmed: false,
        isCorrect: null,
        passed: false,
        fichaNumber: `FICHA ${String(index + 1).padStart(3, "0")}`,
      }
    })
}

export function getResultCopy(score) {
  if (score === TOTAL_ROUNDS) {
    return {
      title: "Maestro de Atlas · Rigor Absoluto",
      summary: "¡Precisión impecable! Dominas con total exactitud las capitales del mundo.",
    }
  }
  if (score >= 7) {
    return { title: "Expedicionario Avanzado", summary: "Excelente conocimiento geodésico y memoria territorial." }
  }
  if (score >= 4) {
    return { title: "Explorador Geográfico", summary: "Buen recorrido, aunque varias fichas requieren mayor estudio." }
  }
  return { title: "Aprendiz de Rutas", summary: "Has dado tus primeros pasos en el compendio cartográfico." }
}
