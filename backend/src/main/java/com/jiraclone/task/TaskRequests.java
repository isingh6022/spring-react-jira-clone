package com.jiraclone.task;

import com.jiraclone.contributor.Expertise;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class TaskRequests {

	private TaskRequests() {
	}

	// Optional fields default: priority to MEDIUM, demoNeverRoutes to false.
	public record Create(@NotBlank String title, @NotNull Expertise expertise, TaskPriority priority,
			Boolean demoNeverRoutes) {

		public boolean neverRoutes() {
			return Boolean.TRUE.equals(demoNeverRoutes);
		}

	}

	// contributorId is needed for ASSIGN, reason for FAIL; both optional otherwise.
	public record Action(@NotNull TaskAction action, Long contributorId, String reason) {
	}

}
