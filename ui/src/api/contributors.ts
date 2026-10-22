import type { TaskState } from "./tasks";

export interface ExpertiseArea {
  id: number;
  name: string;
}

export interface Contributor {
  id: number;
  name: string;
}

export interface ContributorTaskRef {
  id: number;
  title: string;
  state: TaskState;
}

export interface ContributorDetail extends Contributor {
  expertise: ExpertiseArea[];
  activeTasks: ContributorTaskRef[];
}
