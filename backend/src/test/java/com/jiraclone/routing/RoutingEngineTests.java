package com.jiraclone.routing;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.jiraclone.TestData;
import com.jiraclone.contributor.Contributor;
import com.jiraclone.contributor.ContributorRepository;
import com.jiraclone.contributor.Expertise;
import com.jiraclone.task.TaskAction;
import com.jiraclone.task.TaskDto;
import com.jiraclone.task.TaskRepository;
import com.jiraclone.task.TaskRequests;
import com.jiraclone.task.TaskService;
import com.jiraclone.task.TaskState;

// Drives observe/apply directly (no timers). Test transactions roll back, so the
// after-commit listener never fires and nothing runs in the background.
@SpringBootTest
@Transactional
class RoutingEngineTests {

	@Autowired
	RoutingEngine engine;

	@Autowired
	TaskService taskService;

	@Autowired
	TaskRepository tasks;

	@Autowired
	ContributorRepository contributors;

	@Autowired
	JdbcTemplate jdbc;

	Contributor alice;

	@BeforeEach
	void seed() {
		TestData.clear(jdbc);
		alice = contributors.save(new Contributor("Alice", Expertise.FINANCE));
	}

	@Test
	void assignsAnEligibleContributor() {
		TaskDto task = create(Expertise.FINANCE);
		RoutingRequested request = requestFor(task);

		engine.apply(request, engine.observe(request));

		TaskDto after = taskService.get(task.id());
		assertThat(after.state()).isEqualTo(TaskState.ASSIGNED);
		assertThat(after.assignee().name()).isEqualTo("Alice");
		assertThat(after.history()).last().extracting(TaskDto.Event::message).isEqualTo("Routing selected Alice");
	}

	@Test
	void reportsNoMatch() {
		TaskDto task = create(Expertise.LEGAL);
		RoutingRequested request = requestFor(task);

		engine.apply(request, engine.observe(request));

		assertThat(taskService.get(task.id()).state()).isEqualTo(TaskState.NO_MATCH);
	}

	@Test
	void lateResultAfterInterventionChangesNothing() {
		Contributor eve = contributors.save(new Contributor("Eve", Expertise.FINANCE));
		TaskDto task = create(Expertise.FINANCE);
		RoutingRequested request = requestFor(task);
		RoutingEngine.Snapshot snapshot = engine.observe(request);

		// The operator steps in while the request is pending...
		taskService.act(task.id(), new TaskRequests.Action(TaskAction.ASSIGN, eve.getId(), null));
		int eventsBefore = taskService.get(task.id()).history().size();

		// ...then the outstanding request returns.
		engine.apply(request, snapshot);

		TaskDto after = taskService.get(task.id());
		assertThat(after.assignee().name()).isEqualTo("Eve");
		assertThat(after.history()).hasSize(eventsBefore);
	}

	@Test
	void doesNotObserveASupersededRequest() {
		TaskDto task = create(Expertise.FINANCE);
		RoutingRequested first = requestFor(task);

		TaskDto rerouted = taskService.act(task.id(), new TaskRequests.Action(TaskAction.REROUTE, null, null));

		assertThat(engine.observe(first)).isNull();
		assertThat(engine.observe(requestFor(rerouted))).isNotNull();
	}

	private TaskDto create(Expertise expertise) {
		return taskService.create(new TaskRequests.Create("Task", expertise, null, null));
	}

	private RoutingRequested requestFor(TaskDto task) {
		return new RoutingRequested(task.id(), tasks.findById(task.id()).orElseThrow().getRoutingStartedAt());
	}

}
