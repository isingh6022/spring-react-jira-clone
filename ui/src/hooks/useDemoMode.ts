import { useUrlParams } from "./useUrlParams";

export function useDemoMode() {
  return useUrlParams().get("demo") === "1";
}
