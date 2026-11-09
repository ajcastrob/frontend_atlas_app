import { ANSWER_KEYS } from "@/lib/constants.js";

export function getOptionIndex(key) {
  const letterIndex = ANSWER_KEYS.indexOf(key);
  if (letterIndex >= 0) return letterIndex;

  const numberIndex = Number(key) - 1;
  return Number.isInteger(numberIndex) ? numberIndex : -1;
}
