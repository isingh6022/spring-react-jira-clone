package com.jiraclone.routing;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

// Placeholder: the simulated engine is not implemented yet, so routed tasks stay in
// ROUTING until the operator intervenes. Runs only after the submitting transaction commits.
@Component
public class RoutingEngine {

	private static final Logger log = LoggerFactory.getLogger(RoutingEngine.class);

	@TransactionalEventListener
	public void onRoutingRequested(RoutingRequested request) {
		log.info("Routing requested for task {} (started {}); engine not implemented yet", request.taskId(),
				request.routingStartedAt());
	}

}
