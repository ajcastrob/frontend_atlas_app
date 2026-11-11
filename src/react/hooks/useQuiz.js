import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { getResultCopy } from "@/lib/game.js";
import { loadGameState, saveGameState } from "@/lib/gameStorage.js";
import { TOTAL_ROUNDS } from "@/lib/constants.js";
import { initialQuizState, quizReducer } from "../context/quizReducer.js";

export function useQuiz(countries) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const restoredRef = useRef(false);

  // Efecto 1: al montar, recupera la partida guardada en localStorage.
  useEffect(() => {
    const snapshot = loadGameState();

    if (!snapshot) return;

    restoredRef.current = true;
    dispatch({ type: "RESTORE_GAME", state: snapshot });
  }, []);

  // Efecto 2: con los países listos, arranca partida nueva solo si no se restauró nada.
  useEffect(() => {
    if (!countries.length) return;
    if (restoredRef.current) return;
    if (state.questions.length) return;

    dispatch({ type: "INIT_GAME", countries, startedAt: Date.now() });
  }, [countries, state.questions.length]);

  // Efecto 3: persiste el snapshot en cada cambio de estado relevante.
  useEffect(() => {
    if (!state.questions.length) return;

    saveGameState({
      questions: state.questions,
      currentIndex: state.currentIndex,
      score: state.score,
      finished: state.finished,
      startedAt: state.startedAt,
      finishedAt: state.finishedAt,
    });
  }, [state]);

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
    dispatch({ type: "NEXT_ROUND", at: Date.now() });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: "RESTART_GAME", countries, startedAt: Date.now() });
  }, [countries]);

  return {
    current,
    currentIndex: state.currentIndex,
    finished: state.finished,
    finishedAt: state.finishedAt,
    next,
    pass,
    progress,
    questions: state.questions,
    result,
    restart,
    score: state.score,
    sessionId: state.sessionId,
    startedAt: state.startedAt,
    selectOption,
    confirm,
  };
}
