import { Finished } from "./components/Finished.jsx";
import { Bandera } from "./components/Bandera.jsx";
import { QuizCountries } from "./components/QuizCountries.jsx";
import { TOTAL_ROUNDS } from "../lib/constants.js";
import { useCountries } from "./hooks/useCountries.js";
import { useQuiz } from "./hooks/useQuiz.js";
import { useQuizKeyboard } from "./hooks/useQuizKeyboard.js";
import "../styles/game.css";

export default function Game() {
  const { countries, loading, error } = useCountries();
  const {
    confirm,
    current,
    currentIndex,
    finished,
    next,
    pass,
    progress,
    questions,
    result,
    restart,
    score,
    selectOption,
  } = useQuiz(countries);

  useQuizKeyboard({
    current,
    finished,
    confirm,
    selectOption,
    next,
  });

  if (loading) {
    return (
      <div className="game-container">
        <div className="game-loading">
          <div className="game-loading__line" />
          <span>Consultando archivo cartográfico...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-container">
        <div className="game-loading" role="alert">
          <span>{error}</span>
          <button
            className="quiz-btn-primary"
            type="button"
            onClick={() => window.location.reload()}
          >
            REINTENTAR
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <Finished
        result={result}
        score={score}
        questions={questions}
        totalRounds={TOTAL_ROUNDS}
        onRestart={restart}
      />
    );
  }

  if (!current) return null;

  const { country } = current;

  return (
    <div className="game-container">
      <nav className="game-breadcrumb" aria-label="Navegación geográfica">
        <div>
          <a href="/">ATLAS</a>
          <span>/</span>
          <span>{country.region.toUpperCase()}</span>
          <span>/</span>
          <strong>{country.name.toUpperCase()}</strong>
        </div>
      </nav>

      <div className="game-stage">
        <Bandera country={country} />
        <QuizCountries
          country={country}
          current={current}
          selectOption={selectOption}
          currentIndex={currentIndex}
          progress={progress}
          confirm={confirm}
          next={next}
          pass={pass}
        />
      </div>
    </div>
  );
}
