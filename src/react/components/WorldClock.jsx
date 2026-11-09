import { formatElapsedTime } from "../hooks/useElapsedTime.js";

export function WorldClock({ elapsedSeconds, variant = "compact" }) {
  const secondAngle = (elapsedSeconds % 60) * 6;
  const minuteAngle = ((elapsedSeconds / 60) % 60) * 6;

  return (
    <div className={`world-clock world-clock--${variant}`}>
      <div
        className="world-clock__face"
        aria-hidden="true"
        style={{ "--minute-angle": `${minuteAngle}deg`, "--second-angle": `${secondAngle}deg` }}
      >
        <span className="world-clock__latitude" />
        <span className="world-clock__longitude" />
        <span className="world-clock__hand world-clock__hand--minute" />
        <span className="world-clock__hand world-clock__hand--second" />
        <span className="world-clock__pin" />
      </div>
      <div className="world-clock__copy">
        <span>Tiempo de ruta</span>
        <time dateTime={`PT${elapsedSeconds}S`}>{formatElapsedTime(elapsedSeconds)}</time>
      </div>
    </div>
  );
}
