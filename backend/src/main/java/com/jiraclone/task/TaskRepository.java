package com.jiraclone.task;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

	@EntityGraph(attributePaths = "assignee")
	List<Task> findAllByOrderByCreatedAtDesc();

	@EntityGraph(attributePaths = "assignee")
	List<Task> findByStateOrderByCreatedAtDesc(TaskState state);

}
