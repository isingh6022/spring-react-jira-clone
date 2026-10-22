import { expertiseAreas } from "../api/mockData";

// Mock implementation. Will call GET /api/expertise-areas later.
export function useExpertiseAreas() {
  return { data: expertiseAreas, loading: false, error: null as string | null };
}
