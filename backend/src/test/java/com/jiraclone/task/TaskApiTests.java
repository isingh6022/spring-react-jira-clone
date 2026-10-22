package com.jiraclone.task;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.annotation.Transactional;

import com.jiraclone.TestData;
import com.jiraclone.contributor.Contributor;
import com.jiraclone.contributor.ContributorRepository;
import com.jiraclone.contributor.Expertise;

import tools.jackson.databind.json.JsonMapper;

// Through HTTP against the real Postgres (make db-up); each test rolls back.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TaskApiTests {

	@Autowired
	MockMvc mvc;

	@Autowired
	JsonMapper json;

	@Autowired
	JdbcTemplate jdbc;

	@Autowired
	ContributorRepository contributors;

	Contributor alice;

	Contributor ben;

	@BeforeEach
	void seed() {
		TestData.clear(jdbc);
		alice = contributors.save(new Contributor("Alice", Expertise.FINANCE));
		ben = contributors.save(new Contributor("Ben", Expertise.HEALTHCARE));
	}

	@Test
	void createStartsRouting() throws Exception {
		send(post("/api/tasks"), "{\"title\":\"Budget review\",\"expertise\":\"FINANCE\"}")
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.state").value("ROUTING"))
			.andExpect(jsonPath("$.priority").value("MEDIUM"))
			.andExpect(jsonPath("$.history[0].message").value("Created and submitted for routing"));
	}

	@Test
	void routineAssignmentFlow() throws Exception {
		long id = create();

		act(id, "{\"action\":\"ASSIGN\",\"contributorId\":%d}".formatted(alice.getId()))
			.andExpect(jsonPath("$.assignee.name").value("Alice"))
			.andExpect(jsonPath("$.history[1].message").value("Assigned to Alice while routing was pending"));
		act(id, "{\"action\":\"ACCEPT\"}").andExpect(jsonPath("$.state").value("ACCEPTED"));
		act(id, "{\"action\":\"START\"}").andExpect(jsonPath("$.state").value("IN_PROGRESS"));
		act(id, "{\"action\":\"COMPLETE\"}").andExpect(jsonPath("$.state").value("DONE"))
			.andExpect(jsonPath("$.allowedActions").isEmpty())
			.andExpect(jsonPath("$.history[4].actor").value("Alice"));
	}

	@Test
	void recoverAfterFailure() throws Exception {
		long id = create();
		act(id, "{\"action\":\"ASSIGN\",\"contributorId\":%d}".formatted(alice.getId()));

		act(id, "{\"action\":\"FAIL\"}").andExpect(status().isBadRequest());
		act(id, "{\"action\":\"FAIL\",\"reason\":\"No access\"}").andExpect(jsonPath("$.state").value("FAILED"))
			.andExpect(jsonPath("$.assignee").isEmpty())
			.andExpect(jsonPath("$.history[2].message").value("Failed: No access"));
		act(id, "{\"action\":\"REROUTE\"}").andExpect(jsonPath("$.state").value("ROUTING"));
	}

	@Test
	void rejectsInvalidActions() throws Exception {
		long id = create();

		act(id, "{\"action\":\"ACCEPT\"}").andExpect(status().isConflict())
			.andExpect(status().reason("Cannot accept a task that is ROUTING"));
		act(id, "{\"action\":\"ASSIGN\",\"contributorId\":%d}".formatted(ben.getId()))
			.andExpect(status().isBadRequest())
			.andExpect(status().reason("Ben has no FINANCE expertise"));
		mvc.perform(get("/api/tasks/999999")).andExpect(status().isNotFound());
	}

	@Test
	void listsByState() throws Exception {
		create();

		mvc.perform(get("/api/tasks").param("state", "ROUTING")).andExpect(jsonPath("$.length()").value(1));
		mvc.perform(get("/api/tasks").param("state", "DONE")).andExpect(jsonPath("$.length()").value(0));
		mvc.perform(get("/api/contributors")).andExpect(jsonPath("$[0].expertise").value("FINANCE"));
	}

	private long create() throws Exception {
		String body = send(post("/api/tasks"), "{\"title\":\"Budget review\",\"expertise\":\"FINANCE\"}")
			.andReturn()
			.getResponse()
			.getContentAsString();
		return json.readTree(body).get("id").asLong();
	}

	private ResultActions act(long id, String body) throws Exception {
		return send(post("/api/tasks/" + id + "/actions"), body);
	}

	private ResultActions send(MockHttpServletRequestBuilder request, String body) throws Exception {
		return mvc.perform(request.contentType(MediaType.APPLICATION_JSON).content(body));
	}

}
