import { useMockHealthData } from "../hooks/useMockHealthData";

function MockData() {
  const { data, error, loading } = useMockHealthData();

  if (loading) {
    return <p>Checking backend…</p>;
  }
  if (error) {
    return <p>Backend unreachable: {error}</p>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default MockData;
