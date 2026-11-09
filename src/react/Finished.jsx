import { ArrowButton } from "./ArrowButton";
import { TOTAL_ROUNDS } from "@/lib/constants";

export const Finished = ({ result, score, questions, totalRounds, onRestart }) => {
  return (
    <main className="game-container game-container--results">
      <section className="game-results" aria-label="Resultados de la expedición">
        <span className="game-results__badge">RONDA FINALIZADA · {TOTAL_ROUNDS} PAÍSES</span>
        <h1>{result.title}</h1>
        <p>{result.summary}</p>
        <div className="game-results__score-box">
          <strong>
            {score} / {totalRounds}
          </strong>
          <span>Aciertos oficiales registrados</span>
        </div>
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
