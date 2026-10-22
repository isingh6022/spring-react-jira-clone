package com.jiraclone.task;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

// Append-only: created through Task.record(...) and never modified.
@Entity
public class TaskEvent {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	private Task task;

	private Instant at = Instant.now();

	private String actor;

	// The state the task moved to; null if the event did not change it.
	@Enumerated(EnumType.STRING)
	private TaskState state;

	private String message;

	protected TaskEvent() {
	}

	TaskEvent(Task task, String actor, TaskState state, String message) {
		this.task = task;
		this.actor = actor;
		this.state = state;
		this.message = message;
	}

	public Long getId() {
		return id;
	}

	public Instant getAt() {
		return at;
	}

	public String getActor() {
		return actor;
	}

	public TaskState getState() {
		return state;
	}

	public String getMessage() {
		return message;
	}

}
