import { ArrowButton } from "./ArrowButton";
import { WorldClock } from "./WorldClock.jsx";

export const Finished = ({ result, score, questions, totalRounds, elapsedSeconds, onRestart }) => {
  return (
    <main className="game-container game-container--results">
      <section className="game-results" aria-label="Resultados de la expedición">
        <span className="game-results__badge">EXPEDICIÓN FINALIZADA</span>
        <div className="game-results__score-box">
          <span className="game-results__score-label">{result.title}</span>
          <h1 aria-label={`${score} / ${totalRounds}. Expedición finalizada`}>
            {score} / {totalRounds}
          </h1>
          <span className="game-results__score-note">Aciertos oficiales registrados</span>
        </div>
        <p>{result.summary}</p>
        <WorldClock elapsedSeconds={elapsedSeconds} variant="result" />
        <div className="game-results__history">
          {questions.map((question, index) => (
            <div className="game-results__item" key={question.country.iso_code}>
              <span className="game-results__item-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{question.country.name}</strong>
              <span>{question.country.capital}</span>
              <b
                className={question.isCorrect ? "is-good" : question.passed ? "is-pass" : "is-bad"}
              >
                {question.isCorrect ? "✓" : question.passed ? "↷" : "×"}
              </b>
            </div>
          ))}
        </div>
        <div className="game-results__actions">
          <ArrowButton className="quiz-btn-primary" onClick={onRestart}>
            NUEVA PARTIDA
          </ArrowButton>
          <a className="quiz-btn-pass" href="/">
            VOLVER AL INICIO
          </a>
        </div>
      </section>
    </main>
  );
};
