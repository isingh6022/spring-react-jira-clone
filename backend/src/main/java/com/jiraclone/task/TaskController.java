package com.jiraclone.task;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

	private final TaskService taskService;

	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}

	@GetMapping
	public List<TaskDto> list(@RequestParam(required = false) TaskState state) {
		return taskService.list(state);
	}

	@GetMapping("/{id}")
	public TaskDto get(@PathVariable Long id) {
		return taskService.get(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public TaskDto create(@Valid @RequestBody TaskRequests.Create request) {
		return taskService.create(request);
	}

	@PostMapping("/{id}/actions")
	public TaskDto act(@PathVariable Long id, @Valid @RequestBody TaskRequests.Action request) {
		return taskService.act(id, request);
	}

}
