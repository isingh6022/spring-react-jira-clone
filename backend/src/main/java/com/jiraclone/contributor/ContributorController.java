package com.jiraclone.contributor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contributors")
public class ContributorController {

	private final ContributorRepository contributors;

	public ContributorController(ContributorRepository contributors) {
		this.contributors = contributors;
	}

	@GetMapping
	public List<ContributorDto> list() {
		return contributors.findAllByOrderByNameAsc().stream().map(ContributorDto::from).toList();
	}

}
