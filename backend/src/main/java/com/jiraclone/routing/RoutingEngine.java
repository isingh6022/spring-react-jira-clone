package com.jiraclone.routing;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.support.TransactionTemplate;

import com.jiraclone.contributor.Contributor;
import com.jiraclone.contributor.ContributorRepository;
import com.jiraclone.contributor.Expertise;
import com.jiraclone.task.Task;
import com.jiraclone.task.TaskRepository;
import com.jiraclone.task.TaskState;

import jakarta.annotation.PreDestroy;

// Simulated routing engine. Each request: snapshot the task, wait 5-20s, then pick an
// eligible contributor or report no match. Some requests never return, and nothing
// announces that. A result is applied only if the task is unchanged since the snapshot,
// so an operator who intervened in the meantime always wins.
//
// Pending requests live in memory: a restart loses them, and those tasks stay in
// ROUTING exactly like requests that never return.
@Component
public class RoutingEngine {

	static final String SYSTEM = "System";

	private static final Logger log = LoggerFactory.getLogger(RoutingEngine.class);

	private final TaskRepository tasks;

	private final ContributorRepository contributors;

	private final TransactionTemplate tx;

	private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(4);

	@Value("${routing.min-delay-ms:5000}")
	private long minDelayMs;

	@Value("${routing.max-delay-ms:20000}")
	private long maxDelayMs;

	@Value("${routing.never-return-rate:0.2}")
	private double neverReturnRate;

	public RoutingEngine(TaskRepository tasks, ContributorRepository contributors, TransactionTemplate tx) {
		this.tasks = tasks;
		this.contributors = contributors;
		this.tx = tx;
	}

	// The task as the engine saw it when routing was requested.
	record Snapshot(long version, Expertise expertise, boolean neverReturns, List<Long> candidateIds) {
	}

	// Runs after the submitting transaction commits, so the task is visible to the engine.
	@TransactionalEventListener
	public void onRoutingRequested(RoutingRequested request) {
		executor.execute(routeAndLog(() -> route(request)));
	}

	private void route(RoutingRequested request) {
		Snapshot snapshot = observe(request);
		if (snapshot == null) {
			log.info("Routing request for task {} superseded before the engine picked it up", request.taskId());
			return;
		}
		if (snapshot.neverReturns() || ThreadLocalRandom.current().nextDouble() < neverReturnRate) {
			log.info("Routing for task {} will never return", request.taskId());
			return;
		}
		long delay = ThreadLocalRandom.current().nextLong(minDelayMs, maxDelayMs + 1);
		log.info("Routing for task {} will return in {} ms", request.taskId(), delay);
		executor.schedule(routeAndLog(() -> apply(request, snapshot)), delay, TimeUnit.MILLISECONDS);
	}

	// Scheduled executors swallow exceptions; make them visible in the log.
	private static Runnable routeAndLog(Runnable work) {
		return () -> {
			try {
				work.run();
			}
			catch (RuntimeException e) {
				log.error("Routing engine failure", e);
			}
		};
	}

	// Null if the task already moved on (e.g. the operator acted before the engine started).
	Snapshot observe(RoutingRequested request) {
		return tx.execute(status -> tasks.findById(request.taskId())
			.filter(t -> t.getState() == TaskState.ROUTING
					&& request.routingStartedAt().equals(t.getRoutingStartedAt()))
			.map(t -> new Snapshot(t.getVersion(), t.getExpertise(), t.isDemoNeverRoutes(),
					contributors.findByExpertiseOrderByNameAsc(t.getExpertise())
						.stream()
						.map(Contributor::getId)
						.toList()))
			.orElse(null));
	}

	void apply(RoutingRequested request, Snapshot snapshot) {
		try {
			tx.executeWithoutResult(status -> {
				Task task = tasks.findById(request.taskId()).orElse(null);
				if (task == null || task.getVersion() != snapshot.version()) {
					log.info("Routing result for task {} ignored: task changed since routing was requested",
							request.taskId());
					return;
				}
				Contributor chosen = pick(snapshot.candidateIds());
				if (chosen == null) {
					task.record(SYSTEM, TaskState.NO_MATCH, "No contributor with " + snapshot.expertise() + " expertise");
				}
				else {
					task.setAssignee(chosen);
					task.record(SYSTEM, TaskState.ASSIGNED, "Routing selected " + chosen.getName());
				}
			});
		}
		catch (ObjectOptimisticLockingFailureException e) {
			// The operator acted between our check and our commit; their change stands.
			log.info("Routing result for task {} ignored: task changed concurrently", request.taskId());
		}
	}

	private Contributor pick(List<Long> candidateIds) {
		if (candidateIds.isEmpty()) {
			return null;
		}
		Long id = candidateIds.get(ThreadLocalRandom.current().nextInt(candidateIds.size()));
		return contributors.findById(id).orElse(null);
	}

	@PreDestroy
	void shutdown() {
		executor.shutdownNow();
	}

}
