package com.jiraclone;

import org.springframework.jdbc.core.JdbcTemplate;

// Tests share the app's database, which holds seed data. Clearing it inside the
// test's transaction isolates the test; the rollback afterwards restores the seed.
public final class TestData {

	private TestData() {
	}

	public static void clear(JdbcTemplate jdbc) {
		jdbc.execute("delete from task_event");
		jdbc.execute("delete from task");
		jdbc.execute("delete from contributor");
	}

}
