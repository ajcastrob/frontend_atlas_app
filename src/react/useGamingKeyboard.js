import { useCallback, useEffect } from "react";
import { TOTAL_ROUNDS } from "../lib/constants.js";
import { getOptionIndex } from "@/lib/optionsIndex.js";

export const useGamingKeyboard = ({
  current,
  finished,
  setFinished,
  currentIndex,
  setCurrentIndex,
  updateCurrent,
  confirm,
  selectOption,
}) => {
  const pass = useCallback(() => {
    if (!current || current.confirmed) return;
    updateCurrent({ confirmed: true, isCorrect: false, passed: true });
  }, [current, updateCurrent]);

  const next = useCallback(() => {
    if (currentIndex + 1 < TOTAL_ROUNDS) {
      setCurrentIndex((value) => value + 1);
      return;
    }

    setFinished(true);
  }, [currentIndex]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (!current || finished) return;

      const key = event.key.toUpperCase();
      if (!current.confirmed) {
        const optionIndex = getOptionIndex(key);
        const option = current.options[optionIndex];

        if (option) {
          selectOption(option);
          return;
        }

        if (event.key === "Enter" && current.selectedOption) confirm();
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        next();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirm, current, finished, next, selectOption]);

  return {
    pass,
    next,
  };
};
