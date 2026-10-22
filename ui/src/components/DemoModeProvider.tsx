import { useMemo, useState, type ReactNode } from "react";
import { DemoModeContext } from "../hooks/useDemoMode";

// App-wide demo mode, kept across page navigation.
function DemoModeProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useState(false);
  const value = useMemo(() => ({ demoMode, setDemoMode }), [demoMode]);

  return (
    <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>
  );
}

export default DemoModeProvider;
