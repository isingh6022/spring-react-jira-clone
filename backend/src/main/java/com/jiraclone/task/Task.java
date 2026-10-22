package com.jiraclone.task;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.jiraclone.contributor.Contributor;
import com.jiraclone.contributor.Expertise;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Version;

@Entity
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	@Enumerated(EnumType.STRING)
	private Expertise expertise;

	@Enumerated(EnumType.STRING)
	private TaskPriority priority = TaskPriority.MEDIUM;

	@Enumerated(EnumType.STRING)
	private TaskState state = TaskState.ROUTING;

	@ManyToOne(fetch = FetchType.LAZY)
	private Contributor assignee;

	// Demo flag: automatic routing never returns for this task.
	private boolean demoNeverRoutes;

	private Instant createdAt = Instant.now();

	private Instant routingStartedAt;

	// Catches concurrent writes, e.g. a routing result landing while the operator acts.
	@Version
	private long version;

	@OneToMany(mappedBy = "task", cascade = CascadeType.PERSIST)
	@OrderBy("at ASC, id ASC")
	private List<TaskEvent> history = new ArrayList<>();

	protected Task() {
	}

	public Task(String title, Expertise expertise, TaskPriority priority, boolean demoNeverRoutes) {
		this.title = title;
		this.expertise = expertise;
		this.priority = priority;
		this.demoNeverRoutes = demoNeverRoutes;
	}

	// Appends to the history and moves to newState (null keeps the current state).
	public void record(String actor, TaskState newState, String message) {
		if (newState != null) {
			state = newState;
		}
		history.add(new TaskEvent(this, actor, newState, message));
	}

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public Expertise getExpertise() {
		return expertise;
	}

	public TaskPriority getPriority() {
		return priority;
	}

	public TaskState getState() {
		return state;
	}

	public Contributor getAssignee() {
		return assignee;
	}

	public void setAssignee(Contributor assignee) {
		this.assignee = assignee;
	}

	public boolean isDemoNeverRoutes() {
		return demoNeverRoutes;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getRoutingStartedAt() {
		return routingStartedAt;
	}

	public void setRoutingStartedAt(Instant routingStartedAt) {
		this.routingStartedAt = routingStartedAt;
	}

	public List<TaskEvent> getHistory() {
		return history;
	}

}
