// Temporary mock data used by the UI until the backend exists.
// Later this becomes the seed data, so it is kept internally consistent:
// histories match states, and active tasks match assignees.
import type {
  Contributor,
  ContributorDetail,
  ExpertiseArea,
} from "./contributors";
import type {
  ActorType,
  TaskAction,
  TaskDetail,
  TaskEvent,
  TaskState,
} from "./tasks";

const now = Date.now();
const ago = (seconds: number) => new Date(now - seconds * 1000).toISOString();

export const expertiseAreas: ExpertiseArea[] = [
  { id: 1, name: "Finance" },
  { id: 2, name: "Healthcare" },
  { id: 3, name: "Data analysis" },
  { id: 4, name: "Operations" },
  // No contributor has this one, so routing returns no match.
  { id: 5, name: "Legal" },
];

const area = (id: number) => expertiseAreas.find((a) => a.id === id)!;

const contributorBase: (Contributor & { expertiseIds: number[] })[] = [
  { id: 1, name: "Alice Morgan", expertiseIds: [1, 3] },
  { id: 2, name: "Ben Okafor", expertiseIds: [3, 2] },
  { id: 3, name: "Chen Wei", expertiseIds: [4] },
  { id: 4, name: "Dana Ruiz", expertiseIds: [2, 1] },
  { id: 5, name: "Eve Larsen", expertiseIds: [1, 4] },
  { id: 6, name: "Farid Haddad", expertiseIds: [4, 3] },
];

const contributor = (id: number): Contributor => {
  const c = contributorBase.find((c) => c.id === id)!;
  return { id: c.id, name: c.name };
};

const OPERATOR_ACTIONS: TaskAction[] = ["EDIT", "ASSIGN", "REROUTE", "CANCEL"];

// Mirrors the agreed rules: operator can intervene until acceptance or after
// a decline/failure; demo contributor actions follow the lifecycle.
const allowedActions: Record<TaskState, TaskAction[]> = {
  ROUTING: OPERATOR_ACTIONS,
  NO_MATCH: OPERATOR_ACTIONS,
  ASSIGNED: [...OPERATOR_ACTIONS, "ACCEPT", "DECLINE", "FAIL"],
  ACCEPTED: ["START", "FAIL"],
  IN_PROGRESS: ["COMPLETE", "FAIL"],
  DONE: [],
  DECLINED: OPERATOR_ACTIONS,
  FAILED: OPERATOR_ACTIONS,
  CANCELLED: [],
};

let nextEventId = 1;

const event = (
  secondsAgo: number,
  type: string,
  actorType: ActorType,
  actorName: string | null,
  fromState: TaskState | null,
  toState: TaskState | null,
  message: string,
): TaskEvent => ({
  id: nextEventId++,
  at: ago(secondsAgo),
  type,
  actorType,
  actorName,
  fromState,
  toState,
  message,
});

const created = (secondsAgo: number) =>
  event(secondsAgo, "TASK_CREATED", "OPERATOR", "Operator", null, null, "Task created");

const routingStarted = (secondsAgo: number) =>
  event(secondsAgo, "ROUTING_STARTED", "SYSTEM", null, null, "ROUTING", "Submitted for routing");

const matched = (secondsAgo: number, contributorId: number) =>
  event(
    secondsAgo,
    "ROUTING_MATCHED",
    "SYSTEM",
    null,
    "ROUTING",
    "ASSIGNED",
    `Routing selected ${contributor(contributorId).name}`,
  );

const byContributor = (
  secondsAgo: number,
  type: string,
  contributorId: number,
  fromState: TaskState,
  toState: TaskState,
  message: string,
) =>
  event(
    secondsAgo,
    type,
    "CONTRIBUTOR",
    contributor(contributorId).name,
    fromState,
    toState,
    message,
  );

interface TaskSeed {
  id: number;
  title: string;
  description: string;
  expertiseId: number;
  priority: TaskDetail["priority"];
  state: TaskState;
  assigneeId: number | null;
  demoNeverRoutes: boolean;
  createdSecondsAgo: number;
  routingStartedSecondsAgo: number | null;
  history: TaskEvent[];
}

const taskSeeds: TaskSeed[] = [
  {
    id: 1,
    title: "Quarterly budget variance review",
    description: "Compare Q3 actuals against budget and explain variances above 5%.",
    expertiseId: 1,
    priority: "MEDIUM",
    state: "DONE",
    assigneeId: 1,
    demoNeverRoutes: false,
    createdSecondsAgo: 3 * 3600,
    routingStartedSecondsAgo: 3 * 3600,
    history: [
      created(3 * 3600),
      routingStarted(3 * 3600),
      matched(3 * 3600 - 12, 1),
      byContributor(3 * 3600 - 300, "ACCEPTED", 1, "ASSIGNED", "ACCEPTED", "Accepted the assignment"),
      byContributor(3 * 3600 - 600, "STARTED", 1, "ACCEPTED", "IN_PROGRESS", "Started work"),
      byContributor(3600, "COMPLETED", 1, "IN_PROGRESS", "DONE", "Completed the task"),
    ],
  },
  {
    id: 2,
    title: "Patient intake survey analysis",
    description: "Summarise trends from the last six months of intake surveys.",
    expertiseId: 3,
    priority: "MEDIUM",
    state: "IN_PROGRESS",
    assigneeId: 2,
    demoNeverRoutes: false,
    createdSecondsAgo: 2 * 3600,
    routingStartedSecondsAgo: 2 * 3600,
    history: [
      created(2 * 3600),
      routingStarted(2 * 3600),
      matched(2 * 3600 - 8, 2),
      byContributor(2 * 3600 - 900, "ACCEPTED", 2, "ASSIGNED", "ACCEPTED", "Accepted the assignment"),
      byContributor(3600, "STARTED", 2, "ACCEPTED", "IN_PROGRESS", "Started work"),
    ],
  },
  {
    id: 3,
    title: "Vendor onboarding checklist",
    description: "Draft a checklist for onboarding new logistics vendors.",
    expertiseId: 4,
    priority: "LOW",
    state: "ACCEPTED",
    assigneeId: 3,
    demoNeverRoutes: false,
    createdSecondsAgo: 45 * 60,
    routingStartedSecondsAgo: 45 * 60,
    history: [
      created(45 * 60),
      routingStarted(45 * 60),
      matched(45 * 60 - 15, 3),
      byContributor(30 * 60, "ACCEPTED", 3, "ASSIGNED", "ACCEPTED", "Accepted the assignment"),
    ],
  },
  {
    id: 4,
    title: "Clinical trial cost estimate",
    description: "Estimate site costs for a 3-site phase II trial.",
    expertiseId: 2,
    priority: "HIGH",
    state: "ASSIGNED",
    assigneeId: 4,
    demoNeverRoutes: false,
    createdSecondsAgo: 140,
    routingStartedSecondsAgo: 140,
    history: [created(140), routingStarted(140), matched(128, 4)],
  },
  {
    id: 5,
    title: "Supply chain KPI dashboard",
    description: "Define KPIs and data sources for a supply chain dashboard.",
    expertiseId: 3,
    priority: "MEDIUM",
    state: "ROUTING",
    assigneeId: null,
    demoNeverRoutes: false,
    createdSecondsAgo: 8,
    routingStartedSecondsAgo: 8,
    history: [created(8), routingStarted(8)],
  },
  {
    // Unresolved routing: past the normal 20s window, high priority.
    id: 6,
    title: "Hospital staffing forecast",
    description: "Forecast nurse staffing needs for the winter peak.",
    expertiseId: 2,
    priority: "HIGH",
    state: "ROUTING",
    assigneeId: null,
    demoNeverRoutes: true,
    createdSecondsAgo: 4 * 60,
    routingStartedSecondsAgo: 4 * 60,
    history: [created(4 * 60), routingStarted(4 * 60)],
  },
  {
    id: 7,
    title: "Insurance claims compliance review",
    description: "Check a sample of claims against the new regulatory guidance.",
    expertiseId: 5,
    priority: "MEDIUM",
    state: "NO_MATCH",
    assigneeId: null,
    demoNeverRoutes: false,
    createdSecondsAgo: 20 * 60,
    routingStartedSecondsAgo: 20 * 60,
    history: [
      created(20 * 60),
      routingStarted(20 * 60),
      event(20 * 60 - 11, "ROUTING_NO_MATCH", "SYSTEM", null, "ROUTING", "NO_MATCH", "No eligible contributor for Legal"),
    ],
  },
  {
    // Recovery: declined before work began.
    id: 8,
    title: "Cash flow model refresh",
    description: "Update the 13-week cash flow model with October actuals.",
    expertiseId: 1,
    priority: "HIGH",
    state: "DECLINED",
    assigneeId: null,
    demoNeverRoutes: false,
    createdSecondsAgo: 35 * 60,
    routingStartedSecondsAgo: 35 * 60,
    history: [
      created(35 * 60),
      routingStarted(35 * 60),
      matched(35 * 60 - 6, 5),
      byContributor(25 * 60, "DECLINED", 5, "ASSIGNED", "DECLINED", "Declined: on leave this week"),
    ],
  },
  {
    // Recovery: failed after acceptance, before work began.
    id: 9,
    title: "Warehouse process audit",
    description: "Walk through picking and packing steps and flag bottlenecks.",
    expertiseId: 4,
    priority: "MEDIUM",
    state: "FAILED",
    assigneeId: null,
    demoNeverRoutes: false,
    createdSecondsAgo: 90 * 60,
    routingStartedSecondsAgo: 90 * 60,
    history: [
      created(90 * 60),
      routingStarted(90 * 60),
      matched(90 * 60 - 18, 6),
      byContributor(80 * 60, "ACCEPTED", 6, "ASSIGNED", "ACCEPTED", "Accepted the assignment"),
      byContributor(10 * 60, "FAILED", 6, "ACCEPTED", "FAILED", "Failed: site access not granted"),
    ],
  },
  {
    id: 10,
    title: "Duplicate report request",
    description: "Same as an earlier analytics request; raised by mistake.",
    expertiseId: 3,
    priority: "LOW",
    state: "CANCELLED",
    assigneeId: null,
    demoNeverRoutes: false,
    createdSecondsAgo: 60 * 60,
    routingStartedSecondsAgo: 60 * 60,
    history: [
      created(60 * 60),
      routingStarted(60 * 60),
      event(59 * 60, "CANCELLED", "OPERATOR", "Operator", "ROUTING", "CANCELLED", "Cancelled: duplicate of an earlier request"),
    ],
  },
];

export const tasks: TaskDetail[] = taskSeeds.map((t) => ({
  id: t.id,
  title: t.title,
  description: t.description,
  expertise: area(t.expertiseId),
  priority: t.priority,
  state: t.state,
  assignee: t.assigneeId === null ? null : contributor(t.assigneeId),
  createdAt: ago(t.createdSecondsAgo),
  updatedAt: t.history[t.history.length - 1].at,
  routingStartedAt:
    t.routingStartedSecondsAgo === null ? null : ago(t.routingStartedSecondsAgo),
  version: t.history.length,
  allowedActions: allowedActions[t.state],
  demoNeverRoutes: t.demoNeverRoutes,
  history: t.history,
}));

const ACTIVE_STATES: TaskState[] = ["ASSIGNED", "ACCEPTED", "IN_PROGRESS"];

export const contributors: ContributorDetail[] = contributorBase.map((c) => ({
  id: c.id,
  name: c.name,
  expertise: c.expertiseIds.map(area),
  activeTasks: tasks
    .filter((t) => t.assignee?.id === c.id && ACTIVE_STATES.includes(t.state))
    .map((t) => ({ id: t.id, title: t.title, state: t.state })),
}));
