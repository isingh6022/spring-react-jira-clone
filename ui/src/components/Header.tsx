import { hrefWith } from "../utils/url";
import DemoModeToggle from "./DemoModeToggle";

function Header() {
  return (
    <header>
      <h1>
        <a href={hrefWith({ task: null, new: null })}>Task routing</a>
      </h1>
      <nav>
        <a href={hrefWith({ new: "1" })}>New task</a>{" "}
        <DemoModeToggle />
      </nav>
    </header>
  );
}

export default Header;
