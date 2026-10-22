import { useContributors } from "../hooks/useContributors";
import { EXPERTISE_LABELS } from "../utils/labels";
import ErrorMessage from "./ErrorMessage";

function ContributorsPage() {
  const { data: contributors, loading, error } = useContributors();

  if (loading) {
    return <p>Loading contributors…</p>;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section>
      <h2>Contributors</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Expertise</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{EXPERTISE_LABELS[c.expertise]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ContributorsPage;
