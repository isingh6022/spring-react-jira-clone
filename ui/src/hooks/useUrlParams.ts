import { useMemo } from "react";

// Navigation is via plain links for now, so the params only change on page load.
export function useUrlParams() {
  return useMemo(() => new URLSearchParams(window.location.search), []);
}
