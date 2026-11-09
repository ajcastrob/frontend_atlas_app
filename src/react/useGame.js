import { useCallback, useEffect, useMemo, useState } from "react";
import { getResultCopy, makeQuestions } from "../lib/game.js";
import { TOTAL_ROUNDS } from "@/lib/constants.js";
import { ANSWER_KEYS } from "@/lib/constants.js";

function getOptionIndex(key) {
  const letterIndex = ANSWER_KEYS.indexOf(key);
  if (letterIndex >= 0) return letterIndex;

  const numberIndex = Number(key) - 1;
  return Number.isInteger(numberIndex) ? numberIndex : -1;
}

export function useGame({ setQuestions, questions, countries, loading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / TOTAL_ROUNDS) * 100;
  const result = useMemo(() => getResultCopy(score), [score]);

  const startNewGame = useCallback(
    (source = countries) => {
      source = countries;
      if (!source.length) return;

      setQuestions(makeQuestions(source));
      setCurrentIndex(0);
      setScore(0);
      setFinished(false);
    },
    [countries],
  );

  const updateCurrent = useCallback(
    (update) => {
      setQuestions((items) =>
        items.map((item, index) => (index === currentIndex ? { ...item, ...update } : item)),
      );
    },
    [currentIndex],
  );

  const selectOption = useCallback(
    (option) => {
      if (!current || current.confirmed) return;
      updateCurrent({ selectedOption: option });
    },
    [current, updateCurrent],
  );

  const confirm = useCallback(() => {
    if (!current?.selectedOption || current.confirmed) return;

    const isCorrect = current.selectedOption === current.country.capital;
    updateCurrent({ confirmed: true, isCorrect });
    if (isCorrect) setScore((value) => value + 1);
  }, [current, updateCurrent]);

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
    current,
    currentIndex,
    finished,
    loading,
    next,
    pass,
    progress,
    result,
    score,
    selectOption,
    startNewGame,
    confirm,
  };
}
