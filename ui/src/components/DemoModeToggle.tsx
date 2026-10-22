import { useDemoMode, useSetDemoMode } from "../hooks/useDemoMode";

function DemoModeToggle() {
  const demoMode = useDemoMode();
  const setDemoMode = useSetDemoMode();

  return (
    <label>
      <input
        type="checkbox"
        checked={demoMode}
        onChange={(e) => setDemoMode(e.target.checked)}
      />{" "}
      Demo mode
    </label>
  );
}

export default DemoModeToggle;
