export const Error = ({ error }) => {
  return (
    <div className="game-container">
      <div className="game-loading" role="alert">
        <span>{error}</span>
        <button className="quiz-btn-primary" type="button" onClick={() => window.location.reload()}>
          REINTENTAR
        </button>
      </div>
    </div>
  );
};
