import { Finished } from "./components/Finished.jsx";
import { Bandera } from "./components/Bandera.jsx";
import { Loading } from "./components/Loading.jsx";
import { Error } from "./components/Error.jsx";
import { QuizCountries } from "./components/QuizCountries.jsx";
import { TOTAL_ROUNDS } from "../lib/constants.js";
import { useCountries } from "./hooks/useCountries.js";
import { useQuiz } from "./hooks/useQuiz.js";
import { useQuizKeyboard } from "./hooks/useQuizKeyboard.js";
import { useElapsedTime } from "./hooks/useElapsedTime.js";
import "../styles/game.css";

export default function Game() {
  const { countries, loading, error } = useCountries();
  const {
    confirm,
    current,
    currentIndex,
    finished,
    finishedAt,
    next,
    pass,
    progress,
    questions,
    result,
    restart,
    score,
    selectOption,
    startedAt,
  } = useQuiz(countries);

  const elapsedSeconds = useElapsedTime(
    Boolean(current && !finished && !loading && !error),
    startedAt,
    finishedAt,
  );

  useQuizKeyboard({
    current,
    finished,
    confirm,
    selectOption,
    next,
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (finished) {
    return (
      <Finished
        result={result}
        score={score}
        questions={questions}
        totalRounds={TOTAL_ROUNDS}
        elapsedSeconds={elapsedSeconds}
        onRestart={restart}
      />
    );
  }

  if (!current?.country) return null;

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
          elapsedSeconds={elapsedSeconds}
          confirm={confirm}
          next={next}
          pass={pass}
        />
      </div>
    </div>
  );
}
