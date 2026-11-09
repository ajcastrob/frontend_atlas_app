import { useEffect } from "react";
import { getOptionIndex } from "@/lib/optionsIndex.js";

export function useQuizKeyboard({ current, finished, selectOption, confirm, next }) {
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

        if (event.key === "Enter" && current.selectedOption) {
          event.preventDefault();
          confirm();
        }

        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        next();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirm, current, finished, next, selectOption]);
}
