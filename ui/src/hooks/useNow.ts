import { useEffect, useState } from "react";

// Current time, refreshed on an interval so elapsed times keep counting.
export function useNow(intervalMs = 5000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
