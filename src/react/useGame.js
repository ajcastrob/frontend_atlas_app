import { useCallback, useMemo, useState } from "react";
import { getResultCopy, makeQuestions } from "../lib/game.js";
import { TOTAL_ROUNDS } from "@/lib/constants.js";

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

  return {
    current,
    updateCurrent,
    currentIndex,
    setCurrentIndex,
    finished,
    setFinished,
    loading,
    progress,
    result,
    score,
    selectOption,
    startNewGame,
    confirm,
  };
}
