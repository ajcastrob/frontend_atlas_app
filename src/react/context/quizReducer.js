import { makeQuestions } from "@/lib/game.js";
import { TOTAL_ROUNDS } from "@/lib/constants.js";

export const initialQuizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  finished: false,
  sessionId: 0,
};

export function createQuizState(countries, sessionId = 0) {
  if (!countries.length) return initialQuizState;

  return {
    ...initialQuizState,
    sessionId,
    questions: makeQuestions(countries),
  };
}

export function quizReducer(state, action) {
  const current = state.questions[state.currentIndex];

  switch (action.type) {
    case "INIT_GAME":
      return createQuizState(action.countries, state.sessionId + 1);

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
        ? { ...state, finished: true }
        : { ...state, currentIndex: state.currentIndex + 1 };
    }

    case "RESTART_GAME":
      return createQuizState(action.countries, state.sessionId + 1);

    default:
      return state;
  }
}
