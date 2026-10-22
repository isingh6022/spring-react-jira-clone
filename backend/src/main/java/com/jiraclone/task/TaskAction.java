package com.jiraclone.task;

public enum TaskAction {

	// Operator
	ASSIGN, REROUTE, CANCEL,

	// Demo mode: the operator acts on behalf of the assigned contributor
	ACCEPT, DECLINE, START, COMPLETE, FAIL

}
