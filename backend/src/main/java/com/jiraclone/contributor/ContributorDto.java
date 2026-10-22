package com.jiraclone.contributor;

public record ContributorDto(Long id, String name, Expertise expertise) {

	public static ContributorDto from(Contributor c) {
		return c == null ? null : new ContributorDto(c.getId(), c.getName(), c.getExpertise());
	}

}
