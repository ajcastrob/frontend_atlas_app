import { makeQuestions } from "@/lib/game.js";
import { TOTAL_ROUNDS } from "@/lib/constants.js";

export const initialQuizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  finished: false,
  sessionId: 0,
  startedAt: null,
  finishedAt: null,
};

export function createQuizState(countries, sessionId = 0, startedAt = null) {
  if (!countries.length) return initialQuizState;

  return {
    ...initialQuizState,
    sessionId,
    startedAt,
    questions: makeQuestions(countries),
  };
}

export function quizReducer(state, action) {
  const current = state.questions[state.currentIndex];

  switch (action.type) {
    case "INIT_GAME":
      // Invariante: una partida en curso (o restaurada) nunca se machaca.
      if (state.questions.length) return state;

      return createQuizState(action.countries, state.sessionId + 1, action.startedAt ?? null);

    case "SELECT_OPTION":
      if (!current || current.confirmed) return state;

      return {
        ...state,
        questions: state.questions.map((question, index) =>
          index === state.currentIndex ? { ...question, selectedOption: action.option } : question,
        ),
      };

    case "CONFIRM_ANSWER": {
      if (!current?.selectedOption || current.confirmed) return state;

      const isCorrect = current.selectedOption === current.country.capital;

      return {
        ...state,
        score: isCorrect ? state.score + 1 : state.score,
        questions: state.questions.map((question, index) =>
          index === state.currentIndex ? { ...question, confirmed: true, isCorrect } : question,
        ),
      };
    }

    case "PASS_QUESTION":
      if (!current || current.confirmed) return state;

      return {
        ...state,
        questions: state.questions.map((question, index) =>
          index === state.currentIndex
            ? {
                ...question,
                confirmed: true,
                isCorrect: false,
                passed: true,
              }
            : question,
        ),
      };

    case "NEXT_ROUND": {
      if (!current?.confirmed) return state;

      const isLastRound = state.currentIndex + 1 >= TOTAL_ROUNDS;

      return isLastRound
        ? { ...state, finished: true, finishedAt: action.at ?? null }
        : { ...state, currentIndex: state.currentIndex + 1 };
    }

    case "RESTORE_GAME": {
      const snapshot = action.state;

      if (!Array.isArray(snapshot?.questions) || !snapshot.questions.length) return state;

      return {
        ...state,
        questions: snapshot.questions,
        currentIndex: snapshot.currentIndex,
        score: snapshot.score,
        finished: snapshot.finished,
        startedAt: snapshot.startedAt ?? null,
        finishedAt: snapshot.finishedAt ?? null,
      };
    }

    case "RESTART_GAME":
      return createQuizState(action.countries, state.sessionId + 1, action.startedAt ?? null);

    default:
      return state;
  }
}
