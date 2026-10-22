package com.jiraclone.task;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import java.time.Instant;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.jiraclone.contributor.Contributor;
import com.jiraclone.contributor.ContributorRepository;
import com.jiraclone.routing.RoutingRequested;

@Service
@Transactional
public class TaskService {

	// No auth yet: every operator action is attributed to a single operator.
	static final String OPERATOR = "Operator";

	private final TaskRepository tasks;

	private final ContributorRepository contributors;

	private final ApplicationEventPublisher publisher;

	public TaskService(TaskRepository tasks, ContributorRepository contributors, ApplicationEventPublisher publisher) {
		this.tasks = tasks;
		this.contributors = contributors;
		this.publisher = publisher;
	}

	@Transactional(readOnly = true)
	public List<TaskDto> list(TaskState state) {
		List<Task> found = state == null ? tasks.findAllByOrderByCreatedAtDesc()
				: tasks.findByStateOrderByCreatedAtDesc(state);
		return found.stream().map(t -> TaskDto.from(t, false)).toList();
	}

	@Transactional(readOnly = true)
	public TaskDto get(Long id) {
		return TaskDto.from(load(id), true);
	}

	public TaskDto create(TaskRequests.Create request) {
		TaskPriority priority = request.priority() == null ? TaskPriority.MEDIUM : request.priority();
		Task task = tasks.save(new Task(request.title().strip(), request.expertise(), priority,
				request.neverRoutes()));
		startRouting(task, request.neverRoutes() ? "Created and submitted for routing (demo: never routes)"
				: "Created and submitted for routing");
		return saved(task);
	}

	public TaskDto act(Long id, TaskRequests.Action request) {
		Task task = load(id);
		if (!task.getState().allowedActions().contains(request.action())) {
			throw new ResponseStatusException(CONFLICT,
					"Cannot " + request.action().name().toLowerCase() + " a task that is " + task.getState());
		}

		String assignee = task.getAssignee() == null ? null : task.getAssignee().getName();
		switch (request.action()) {
			case ASSIGN -> assign(task, request.contributorId());
			case REROUTE -> startRouting(task, withReason("Routing restarted", request.reason()));
			case CANCEL -> {
				task.setAssignee(null);
				task.record(OPERATOR, TaskState.CANCELLED, withReason("Cancelled", request.reason()));
			}
			case ACCEPT -> task.record(assignee, TaskState.ACCEPTED, "Accepted");
			case START -> task.record(assignee, TaskState.IN_PROGRESS, "Started work");
			case COMPLETE -> task.record(assignee, TaskState.DONE, "Completed");
			case DECLINE -> {
				task.record(assignee, TaskState.DECLINED, withReason("Declined", request.reason()));
				task.setAssignee(null);
			}
			case FAIL -> {
				if (request.reason() == null || request.reason().isBlank()) {
					throw new ResponseStatusException(BAD_REQUEST, "A reason is required to fail a task");
				}
				task.record(assignee, TaskState.FAILED, withReason("Failed", request.reason()));
				task.setAssignee(null);
			}
		}
		return saved(task);
	}

	// Flushes first so new history events have their ids in the response.
	private TaskDto saved(Task task) {
		tasks.flush();
		return TaskDto.from(task, true);
	}

	private void assign(Task task, Long contributorId) {
		Contributor contributor = contributorId == null ? null : contributors.findById(contributorId).orElse(null);
		if (contributor == null) {
			throw new ResponseStatusException(BAD_REQUEST, "Choose a contributor to assign");
		}
		if (contributor.getExpertise() != task.getExpertise()) {
			throw new ResponseStatusException(BAD_REQUEST,
					contributor.getName() + " has no " + task.getExpertise() + " expertise");
		}
		String note = task.getState() == TaskState.ROUTING ? " while routing was pending" : "";
		task.setAssignee(contributor);
		task.record(OPERATOR, TaskState.ASSIGNED, "Assigned to " + contributor.getName() + note);
	}

	// Records the request and hands it to the engine once the transaction commits.
	private void startRouting(Task task, String message) {
		task.setAssignee(null);
		task.setRoutingStartedAt(Instant.now());
		task.record(OPERATOR, TaskState.ROUTING, message);
		publisher.publishEvent(new RoutingRequested(task.getId(), task.getRoutingStartedAt()));
	}

	private Task load(Long id) {
		return tasks.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Task " + id + " not found"));
	}

	private static String withReason(String message, String reason) {
		return reason == null || reason.isBlank() ? message : message + ": " + reason.strip();
	}

}
