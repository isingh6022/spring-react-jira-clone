import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section>
      <h2>Page not found</h2>
      <Link to="/">Back to tasks</Link>
    </section>
  );
}

export default NotFoundPage;
