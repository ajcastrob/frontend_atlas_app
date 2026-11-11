import { useEffect, useRef, useState } from "react";

export function formatElapsedTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function useElapsedTime(isRunning, startedAt, finishedAt) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const fallbackStartRef = useRef(null);

  useEffect(() => {
    const hasStartedAt = Number.isFinite(startedAt);
    const hasFinishedAt = Number.isFinite(finishedAt);

    // Partida terminada: el reloj queda congelado en la duración final.
    if (hasStartedAt && hasFinishedAt) {
      setElapsedSeconds(Math.max(0, Math.floor((finishedAt - startedAt) / 1000)));
      return undefined;
    }

    if (!isRunning) {
      setElapsedSeconds(
        hasStartedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0,
      );

      return undefined;
    }

    // Si el estado no trae marca de inicio, se usa una local como respaldo.
    if (hasStartedAt) {
      fallbackStartRef.current = startedAt;
    } else if (fallbackStartRef.current === null) {
      fallbackStartRef.current = Date.now();
    }

    const base = fallbackStartRef.current;

    const updateElapsedTime = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - base) / 1000)));
    };

    updateElapsedTime();
    const intervalId = window.setInterval(updateElapsedTime, 250);

    return () => window.clearInterval(intervalId);
  }, [isRunning, startedAt, finishedAt]);

  return elapsedSeconds;
}
