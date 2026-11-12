import { ArrowButton } from "./ArrowButton.jsx";
import { WorldClock } from "./WorldClock.jsx";
import { OPTION_LETTERS, TOTAL_ROUNDS } from "@/lib/constants.js";

export const QuizCountries = ({
  country,
  currentIndex,
  progress,
  current,
  confirm,
  next,
  pass,
  elapsedSeconds,
  selectOption,
}) => {
  return (
    <section className="quiz-module" aria-label="Módulo de examen">
      <div className="quiz-module__meta">
        <span>{country.region.toUpperCase()} · CAPITALES</span>
        <div className="quiz-module__status">
          <WorldClock elapsedSeconds={elapsedSeconds} />
          <strong>
            RONDA {String(currentIndex + 1).padStart(2, "0")} / {TOTAL_ROUNDS}
          </strong>
        </div>
      </div>
      <div className="quiz-module__progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>

      <h1 className="quiz-module__question">
        <span>¿Cuál es la capital de</span>
        <strong>{country.name}?</strong>
      </h1>

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
            {current.isCorrect ? (
              <>
                <span className="quiz-feedback__glyph" aria-hidden="true">
                  ●
                </span>{" "}
                ACIERTO REGISTRADO (+1)
              </>
            ) : current.passed ? (
              <>
                <span className="quiz-feedback__glyph" aria-hidden="true">
                  ↷
                </span>{" "}
                RONDA OMITIDA (0)
              </>
            ) : (
              <>
                <span className="quiz-feedback__glyph" aria-hidden="true">
                  ×
                </span>{" "}
                CAPITAL CORRECTA: {country.capital.toUpperCase()}
              </>
            )}
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
  );
};
