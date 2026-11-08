import { OPTION_LETTERS, TOTAL_ROUNDS } from "../lib/game.js";
import { ArrowButton } from "./ArrowButton.jsx";
import { Finished } from "./Finished.jsx";
import { useGame } from "./useGame.js";
import "../styles/game.css";

export default function Game() {
  const {
    confirm,
    current,
    currentIndex,
    error,
    finished,
    loading,
    next,
    pass,
    progress,
    questions,
    result,
    score,
    selectOption,
    startNewGame,
  } = useGame();

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
  const flagUrl =
    country.flag_url || `https://flagcdn.com/w640/${country.iso_code.toLowerCase()}.png`;

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
        <span className="game-breadcrumb__iso">ISO: {country.iso_code}</span>
      </nav>

      <div className="game-stage">
        <aside className="vexillo-plate" aria-label="Ficha vexilológica">
          <div className="vexillo-plate__header">
            <span>{country.region.toUpperCase()}</span>
            <b>{country.iso_code}</b>
          </div>
          <div className="vexillo-plate__flag-frame">
            <img src={flagUrl} alt={`Pabellón oficial de ${country.name}`} />
          </div>
          <div className="vexillo-plate__footer">
            <h2>{country.name}</h2>
            <span>{country.region.toUpperCase()}</span>
          </div>
        </aside>

        <section className="quiz-module" aria-label="Módulo de examen">
          <div className="quiz-module__meta">
            <span>{country.region.toUpperCase()} · CAPITALES</span>
            <strong>RONDA {String(currentIndex + 1).padStart(2, "0")} / 10</strong>
          </div>
          <div className="quiz-module__progress-bar">
            <div style={{ width: `${progress}%` }} />
          </div>

          <div className="quiz-module__question">
            <span>¿Cuál es la capital de</span>
            <strong>{country.name}?</strong>
          </div>

          <div className="quiz-options" role="radiogroup" aria-label="Opciones de capital">
            {current.options.map((option, index) => {
              const selected = current.selectedOption === option;
              const correct = current.confirmed && option === country.capital;
              const wrong = current.confirmed && selected && !current.isCorrect;

              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={current.confirmed}
                  className={`quiz-option ${selected ? "is-selected" : ""} ${correct ? "is-correct" : ""} ${wrong ? "is-wrong" : ""}`}
                  onClick={() => selectOption(option)}
                >
                  <span className="quiz-option__content">
                    <b>{OPTION_LETTERS[index]}</b>
                    <span>{option}</span>
                  </span>
                  <i aria-hidden="true">{correct ? "✓" : wrong ? "×" : ""}</i>
                </button>
              );
            })}
          </div>

          <div className="quiz-actions">
            {!current.confirmed ? (
              <button className="quiz-btn-pass" type="button" onClick={pass}>
                PASAR <span aria-hidden="true">↷</span>
              </button>
            ) : (
              <p
                className={`quiz-feedback ${current.isCorrect ? "is-good" : current.passed ? "is-pass" : "is-bad"}`}
              >
                {current.isCorrect
                  ? "● ACIERTO REGISTRADO (+1)"
                  : current.passed
                    ? "↷ RONDA OMITIDA (0)"
                    : `× CAPITAL CORRECTA: ${country.capital.toUpperCase()}`}
              </p>
            )}

            {!current.confirmed ? (
              <ArrowButton
                className="quiz-btn-primary"
                type="button"
                disabled={!current.selectedOption}
                onClick={confirm}
              >
                CONFIRMAR
              </ArrowButton>
            ) : (
              <ArrowButton className="quiz-btn-next" type="button" onClick={next}>
                {currentIndex + 1 < TOTAL_ROUNDS ? "SIGUIENTE RONDA" : "VER EXPEDICIÓN"}
              </ArrowButton>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
