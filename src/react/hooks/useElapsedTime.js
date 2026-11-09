import { useEffect, useRef, useState } from "react";

export function formatElapsedTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function useElapsedTime(isRunning, resetKey) {
  const startedAtRef = useRef(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    startedAtRef.current = null;
    setElapsedSeconds(0);
  }, [resetKey]);

  useEffect(() => {
    if (!isRunning) {
      if (startedAtRef.current !== null) {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }

      return undefined;
    }

    if (startedAtRef.current === null) {
      startedAtRef.current = Date.now();
    }

    const updateElapsedTime = () => {
      setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
    };

    updateElapsedTime();
    const intervalId = window.setInterval(updateElapsedTime, 250);

    return () => window.clearInterval(intervalId);
  }, [isRunning, resetKey]);

  return elapsedSeconds;
}
