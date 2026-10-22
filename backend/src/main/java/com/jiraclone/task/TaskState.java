package com.jiraclone.task;

import static com.jiraclone.task.TaskAction.ACCEPT;
import static com.jiraclone.task.TaskAction.ASSIGN;
import static com.jiraclone.task.TaskAction.CANCEL;
import static com.jiraclone.task.TaskAction.COMPLETE;
import static com.jiraclone.task.TaskAction.DECLINE;
import static com.jiraclone.task.TaskAction.FAIL;
import static com.jiraclone.task.TaskAction.REROUTE;
import static com.jiraclone.task.TaskAction.START;

import java.util.List;

public enum TaskState {

	ROUTING, NO_MATCH, ASSIGNED, ACCEPTED, IN_PROGRESS, DONE, DECLINED, FAILED, CANCELLED;

	// The operator can intervene until acceptance, and again after a decline or
	// failure. Contributor actions follow the lifecycle.
	public List<TaskAction> allowedActions() {
		return switch (this) {
			case ROUTING, NO_MATCH, DECLINED, FAILED -> List.of(ASSIGN, REROUTE, CANCEL);
			case ASSIGNED -> List.of(ASSIGN, REROUTE, CANCEL, ACCEPT, DECLINE, FAIL);
			case ACCEPTED -> List.of(START, FAIL);
			case IN_PROGRESS -> List.of(COMPLETE, FAIL);
			case DONE, CANCELLED -> List.of();
		};
	}

}
