import { createContext, useContext } from "react";

export const DemoModeContext = createContext<{
  demoMode: boolean;
  setDemoMode: (on: boolean) => void;
}>({ demoMode: false, setDemoMode: () => {} });

export function useDemoMode() {
  return useContext(DemoModeContext).demoMode;
}

export function useSetDemoMode() {
  return useContext(DemoModeContext).setDemoMode;
}
