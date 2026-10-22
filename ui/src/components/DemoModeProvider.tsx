import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DemoModeContext } from "../hooks/useDemoMode";

const STORAGE_KEY = "demoMode";

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

// App-wide demo mode, kept across page navigation and reloads.
function DemoModeProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useState(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, demoMode ? "1" : "0");
    } catch {
      // Storage unavailable: demo mode just won't persist.
    }
  }, [demoMode]);

  const value = useMemo(() => ({ demoMode, setDemoMode }), [demoMode]);

  return (
    <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>
  );
}

export default DemoModeProvider;
