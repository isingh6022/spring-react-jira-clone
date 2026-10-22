package com.jiraclone.task;

import java.time.Instant;
import java.util.List;

import com.jiraclone.contributor.ContributorDto;
import com.jiraclone.contributor.Expertise;

// history is only filled in for the single-task view; null in the list.
public record TaskDto(Long id, String title, Expertise expertise, TaskPriority priority, TaskState state,
		ContributorDto assignee, boolean demoNeverRoutes, Instant createdAt, Instant routingStartedAt,
		List<TaskAction> allowedActions, List<Event> history) {

	public record Event(Long id, Instant at, String actor, TaskState state, String message) {
	}

	public static TaskDto from(Task task, boolean withHistory) {
		List<Event> history = withHistory ? task.getHistory()
			.stream()
			.map(e -> new Event(e.getId(), e.getAt(), e.getActor(), e.getState(), e.getMessage()))
			.toList() : null;
		return new TaskDto(task.getId(), task.getTitle(), task.getExpertise(), task.getPriority(), task.getState(),
				ContributorDto.from(task.getAssignee()), task.isDemoNeverRoutes(), task.getCreatedAt(),
				task.getRoutingStartedAt(), task.getState().allowedActions(), history);
	}

}
