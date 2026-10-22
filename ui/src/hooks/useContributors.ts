import { fetchContributors, type Contributor } from "../api/contributors";
import { useFetch } from "./useFetch";

const NO_CONTRIBUTORS: Contributor[] = [];

export function useContributors() {
  return useFetch(fetchContributors, NO_CONTRIBUTORS);
}
