import { request } from "./client";

export type Expertise =
  | "FINANCE"
  | "HEALTHCARE"
  | "DATA_ANALYSIS"
  | "OPERATIONS"
  | "LEGAL";

export interface Contributor {
  id: number;
  name: string;
  expertise: Expertise;
}

export function fetchContributors(signal?: AbortSignal) {
  return request<Contributor[]>("/contributors", { signal });
}
