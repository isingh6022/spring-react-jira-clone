import { useDemoMode } from "../hooks/useDemoMode";
import { hrefWith } from "../utils/url";

function DemoModeToggle() {
  const demoMode = useDemoMode();

  return (
    <a href={hrefWith({ demo: demoMode ? null : "1" })}>
      Demo mode: {demoMode ? "on" : "off"}
    </a>
  );
}

export default DemoModeToggle;
