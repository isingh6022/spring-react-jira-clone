import { Link, NavLink } from "react-router";
import DemoModeToggle from "./DemoModeToggle";

function Header() {
  return (
    <header>
      <h1>
        <Link to="/">Task routing</Link>
      </h1>
      <nav>
        <NavLink to="/" end>
          Tasks
        </NavLink>{" "}
        <NavLink to="/contributors">Contributors</NavLink>{" "}
        <NavLink to="/tasks/new">New task</NavLink> <DemoModeToggle />
      </nav>
    </header>
  );
}

export default Header;
