import { Finished } from "./Finished.jsx";
import { useGame } from "./useGame.js";
import { Bandera } from "./Bandera.jsx";
import { QuizCountries } from "./QuizCountries.jsx";
import { TOTAL_ROUNDS } from "../lib/constants.js";
import { useCountries } from "./useCountries.js";
import "../styles/game.css";

export default function Game() {
  const { countries, questions, setQuestions, loading, error } = useCountries();
  const {
    confirm,
    current,
    currentIndex,
    finished,
    next,
    pass,
    progress,
    result,
    score,
    selectOption,
    startNewGame,
  } = useGame({ setQuestions, questions, countries, loading });

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
        onRestart={startNewGame}
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
        <span className="game-breadcrumb__iso">ISO-CODE: {country.iso_code}</span>
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
