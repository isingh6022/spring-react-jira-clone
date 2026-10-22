import { useContributors } from "../hooks/useContributors";
import { hrefWith } from "../utils/url";
import ErrorMessage from "./ErrorMessage";
import StateBadge from "./StateBadge";

function ContributorsPanel() {
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
            <th>Active tasks</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.expertise.map((a) => a.name).join(", ")}</td>
              <td>
                {c.activeTasks.length === 0
                  ? "—"
                  : c.activeTasks.map((t) => (
                      <div key={t.id}>
                        <a href={hrefWith({ task: String(t.id) })}>{t.title}</a>{" "}
                        <StateBadge state={t.state} />
                      </div>
                    ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ContributorsPanel;
