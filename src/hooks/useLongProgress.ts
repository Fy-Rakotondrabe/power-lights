import { useCallback, useEffect, useRef } from "react";

import { useState } from "react";

export const useLongPress = (
  onLongPress: () => void,
  disabled: boolean,
  options = { delay: 1000, vibrationPattern: [100, 50, 200] }
) => {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const end = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    setPressing(false);
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setPressing(true);
    setProgress(0);

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 4;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 40);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate(options.vibrationPattern);
      }
      onLongPress();
      end();
    }, options.delay);
  }, [end, onLongPress, options.delay, options.vibrationPattern]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, []);

  return {
    pressing,
    progress,
    handlers: disabled
      ? null
      : {
          onTouchStart: start,
          onTouchEnd: end,
          onMouseDown: start,
          onMouseUp: end,
          onMouseLeave: end,
        },
  };
};
