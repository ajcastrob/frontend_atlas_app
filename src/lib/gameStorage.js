import { GAME_STATE_KEY, OPTION_LETTERS } from "./constants.js";
import { getUser } from "./auth.js";

const STATE_VERSION = 1;

function getStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function isValidQuestion(question) {
  if (!question || typeof question !== "object") return false;

  const { country, options } = question;

  if (!country || typeof country !== "object") return false;
  if (typeof country.name !== "string") return false;
  if (typeof country.capital !== "string") return false;
  if (typeof country.region !== "string") return false;
  if (!Array.isArray(options) || options.length !== OPTION_LETTERS.length) return false;

  return options.every((option) => typeof option === "string");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getGameStateKey() {
  try {
    const userId = getUser()?.id;

    // Sin id de usuario no hay namespace: se desactiva la persistencia
    // en lugar de compartir una misma clave entre distintos usuarios.
    if (userId === undefined || userId === null || userId === "") return null;

    return `${GAME_STATE_KEY}.${userId}`;
  } catch {
    // El almacenamiento puede estar bloqueado: sin persistencia, sin romper el juego.
    return null;
  }
}

export function saveGameState(state) {
  try {
    const key = getGameStateKey();
    if (!key) return;

    const snapshot = {
      version: STATE_VERSION,
      questions: state?.questions ?? [],
      currentIndex: state?.currentIndex ?? 0,
      score: state?.score ?? 0,
      finished: state?.finished ?? false,
      startedAt: state?.startedAt ?? null,
      finishedAt: state?.finishedAt ?? null,
    };

    getStorage()?.setItem(key, JSON.stringify(snapshot));
  } catch {
    // Modo privado o cuota llena: la partida sigue, solo no se persiste.
  }
}

export function loadGameState() {
  try {
    const key = getGameStateKey();
    if (!key) return null;

    const value = getStorage()?.getItem(key);
    if (!value) return null;

    const parsed = JSON.parse(value);

    if (!parsed || parsed.version !== STATE_VERSION) return null;
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) return null;
    if (!parsed.questions.every(isValidQuestion)) return null;
    if (!Number.isInteger(parsed.currentIndex) || parsed.currentIndex < 0) return null;

    const finished = Boolean(parsed.finished);
    const startedAt = Number.isFinite(parsed.startedAt) ? parsed.startedAt : null;
    const finishedAt = Number.isFinite(parsed.finishedAt) ? parsed.finishedAt : null;

    // Una partida terminada sin marca de cierre dejaría el reloj corriendo.
    if (finished && finishedAt === null) return null;

    return {
      questions: parsed.questions,
      currentIndex: clamp(parsed.currentIndex, 0, parsed.questions.length - 1),
      score: clamp(Number.isInteger(parsed.score) ? parsed.score : 0, 0, parsed.questions.length),
      finished,
      startedAt,
      finishedAt,
    };
  } catch {
    // Almacenamiento bloqueado o snapshot corrupto: se arranca limpio.
    return null;
  }
}

export function clearGameState() {
  try {
    const key = getGameStateKey();
    if (!key) return;

    getStorage()?.removeItem(key);
  } catch {
    // Nada que limpiar si el almacenamiento no está disponible.
  }
}
