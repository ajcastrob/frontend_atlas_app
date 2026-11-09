import { useCallback, useEffect, useMemo, useReducer } from "react";
import { getResultCopy } from "@/lib/game.js";
import { TOTAL_ROUNDS } from "@/lib/constants.js";
import { initialQuizState, quizReducer } from "../context/quizReducer.js";

export function useQuiz(countries) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);

  useEffect(() => {
    if (countries.length) {
      dispatch({ type: "INIT_GAME", countries });
    }
  }, [countries]);

  const current = state.questions[state.currentIndex];
  const progress = current ? ((state.currentIndex + 1) / TOTAL_ROUNDS) * 100 : 0;
  const result = useMemo(() => getResultCopy(state.score), [state.score]);

  const selectOption = useCallback((option) => {
    dispatch({ type: "SELECT_OPTION", option });
  }, []);

  const confirm = useCallback(() => {
    dispatch({ type: "CONFIRM_ANSWER" });
  }, []);

  const pass = useCallback(() => {
    dispatch({ type: "PASS_QUESTION" });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: "NEXT_ROUND" });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: "RESTART_GAME", countries });
  }, [countries]);

  return {
    current,
    currentIndex: state.currentIndex,
    finished: state.finished,
    next,
    pass,
    progress,
    questions: state.questions,
    result,
    restart,
    score: state.score,
    selectOption,
    confirm,
  };
}
