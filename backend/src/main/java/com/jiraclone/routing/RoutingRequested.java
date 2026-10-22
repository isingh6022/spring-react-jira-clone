package com.jiraclone.routing;

import java.time.Instant;

// Published when a task is (re)submitted for routing. routingStartedAt identifies
// this particular request, so a late result for an older one can be recognised.
public record RoutingRequested(Long taskId, Instant routingStartedAt) {
}
