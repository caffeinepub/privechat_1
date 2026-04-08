import { useEffect, useRef } from "react";

interface UsePollingOptions {
  interval?: number;
  focusedInterval?: number;
  enabled?: boolean;
}

/**
 * Polling helper that calls `fn` every `interval` ms when `enabled` is true.
 * Optionally uses a shorter `focusedInterval` when the document has focus.
 * Clears the interval when the component unmounts or `enabled` turns false.
 */
export function usePolling(
  fn: () => void,
  { interval = 3000, focusedInterval, enabled = true }: UsePollingOptions = {},
) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!enabled) return;

    if (!focusedInterval) {
      const id = setInterval(() => fnRef.current(), interval);
      return () => clearInterval(id);
    }

    // Variable interval: shorter when focused, longer when blurred
    let id: ReturnType<typeof setInterval>;

    const startInterval = () => {
      clearInterval(id);
      const ms = document.hasFocus() ? focusedInterval : interval;
      id = setInterval(() => fnRef.current(), ms);
    };

    startInterval();
    window.addEventListener("focus", startInterval);
    window.addEventListener("blur", startInterval);

    return () => {
      clearInterval(id);
      window.removeEventListener("focus", startInterval);
      window.removeEventListener("blur", startInterval);
    };
  }, [interval, focusedInterval, enabled]);
}
