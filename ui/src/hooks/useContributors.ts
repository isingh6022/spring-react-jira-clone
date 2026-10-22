import { contributors } from "../api/mockData";

// Mock implementation. Will call GET /api/contributors later.
export function useContributors() {
  return { data: contributors, loading: false, error: null as string | null };
}
